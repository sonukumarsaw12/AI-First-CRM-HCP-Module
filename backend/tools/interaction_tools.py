from langchain_core.tools import tool
import json

@tool
def log_interaction_tool(hcp_name: str = None, interaction_type: str = None, topics: str = None, sentiment: str = None, date: str = None, time: str = None) -> str:
    """
    Log a new interaction with an HCP. Use this when the user describes a meeting or interaction.
    Extracts relevant details like hcp_name, topics, sentiment, etc.
    """
    # In a real tool, this might write to DB directly, but for LangGraph, 
    # we return a structured JSON string to represent the extracted entity updates.
    data = {k: v for k, v in locals().items() if v is not None}
    return json.dumps({"action": "log", "data": data})

@tool
def edit_interaction_tool(field_name: str, new_value: str) -> str:
    """
    Modify only specific fields of the current interaction. 
    Keep other fields unchanged. Use this when the user asks to change a specific detail.
    Valid field_name: hcp_name, interaction_type, date, time, attendees, topics, materials_shared, samples_distributed, sentiment, outcomes, follow_up.
    """
    return json.dumps({"action": "edit", "data": {field_name: new_value}})

@tool
def summarize_interaction_tool(long_notes: str) -> str:
    """
    Convert long interaction notes or topics into a short, concise summary.
    Use this when the user provides a very long description and asks to summarize it.
    """
    # This simulates a summarization process. In reality, the LLM itself could summarize before calling the tool,
    # or this tool could be a placeholder that indicates we need a separate summarization chain.
    # We will let the LLM generate the summary and pass it as `long_notes`.
    return json.dumps({"action": "summarize", "data": {"topics": f"Summary: {long_notes}"}})

@tool
def suggest_follow_up_tool(context: str) -> str:
    """
    Suggest next actions or follow-up plans based on the conversation context.
    Use this when the user asks for suggestions or next steps.
    """
    return json.dumps({"action": "suggest_follow_up", "data": {"follow_up": context}})

@tool
def extract_entities_tool(text: str, hcp_name: str = None, drugs_mentioned: str = None, time: str = None, sentiment: str = None) -> str:
    """
    Extract specific entities like HCP name, drugs (materials shared or topics), time, and sentiment from unstructured text.
    """
    data = {
        "hcp_name": hcp_name,
        "topics": drugs_mentioned,
        "time": time,
        "sentiment": sentiment
    }
    data = {k: v for k, v in data.items() if v is not None}
    return json.dumps({"action": "extract", "data": data})

tools = [
    log_interaction_tool,
    edit_interaction_tool,
    summarize_interaction_tool,
    suggest_follow_up_tool,
    extract_entities_tool
]
