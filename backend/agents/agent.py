import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import SystemMessage, ToolMessage
from langchain_groq import ChatGroq
import json
import os
from tools.interaction_tools import tools
from dotenv import load_dotenv

load_dotenv()

def merge_dicts(dict1: dict, dict2: dict) -> dict:
    if not dict1: dict1 = {}
    if not dict2: dict2 = {}
    return {**dict1, **dict2}

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    interaction_data: Annotated[dict, merge_dicts]

groq_api_key = os.getenv("GROQ_API_KEY", "your_api_key")
llm = ChatGroq(model="llama-3.3-70b-versatile", groq_api_key=groq_api_key, temperature=0.1)

llm_with_tools = llm.bind_tools(tools)

system_prompt = SystemMessage(content='''You are an AI-first CRM assistant for pharmaceutical sales reps. 
Your goal is to log and manage interactions with Healthcare Professionals (HCPs).
You MUST use the provided tools to extract structured data from user input.
Fields available for extraction: hcp_name, interaction_type, date, time, attendees, topics, materials_shared, samples_distributed, sentiment, outcomes, follow_up.
Always try to extract as many fields as possible in a single tool call when the user provides detailed notes.
Do NOT create conversational filler if a tool call handles the response, but DO reply to the user validating their action.
''')

def llm_node(state: AgentState):
    msgs = state.get("messages", [])
    has_system = any(isinstance(m, SystemMessage) for m in msgs)
    if not has_system:
        msgs = [system_prompt] + msgs
        
    response = llm_with_tools.invoke(msgs)
    return {"messages": [response]}

def should_continue(state: AgentState):
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

def tool_node(state: AgentState):
    last_message = state["messages"][-1]
    
    tool_messages = []
    updates = {}
    
    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        
        selected_tool = next((t for t in tools if t.name == tool_name), None)
        if selected_tool:
            try:
                tool_output_str = selected_tool.invoke(tool_args)
                tool_output = json.loads(tool_output_str)
                updates = merge_dicts(updates, tool_output.get("data", {}))
                
                tool_messages.append(
                    ToolMessage(
                        content=f"Extracted info: {json.dumps(tool_output.get('data', {}))}",
                        tool_call_id=tool_call["id"]
                    )
                )
            except Exception as e:
                tool_messages.append(
                    ToolMessage(
                        content=f"Error interacting with tool: {str(e)}",
                        tool_call_id=tool_call["id"]
                    )
                )
                
    return {"messages": tool_messages, "interaction_data": updates}

workflow = StateGraph(AgentState)

workflow.add_node("agent", llm_node)
workflow.add_node("tools", tool_node)

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        END: END
    }
)

workflow.add_edge("tools", "agent")

compiled_agent = workflow.compile()
