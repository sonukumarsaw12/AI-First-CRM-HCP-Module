import React from 'react';
import { useSelector } from 'react-redux';
import { Stethoscope, Calendar, Clock, Users, FileText, CheckCircle, Lightbulb, Smile, Meh, Frown } from 'lucide-react';

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-gray-100 mt-6 first:mt-0">
    <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h3>
  </div>
);

const ReadOnlyField = ({ label, value, icon, className = "" }) => (
  <div className={`mb-5 ${className}`}>
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-tight mb-1.5 flex items-center">
      {icon && <span className="mr-1.5 opacity-70">{icon}</span>}
      {label}
    </label>
    <div className={`w-full p-3 rounded-xl border transition-all duration-300 flex items-center min-h-[48px] shadow-sm 
      ${value 
        ? 'border-indigo-200 bg-white text-gray-900 ring-2 ring-indigo-50/50' 
        : 'border-gray-200 bg-gray-50/50 text-gray-400 italic'}`}>
      <span className="text-sm font-semibold truncate">
        {value || "Awaiting AI input..."}
      </span>
    </div>
  </div>
);

const ReadOnlyTextarea = ({ label, value, icon }) => (
  <div className="mb-5">
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-tight mb-1.5 flex items-center">
      {icon && <span className="mr-1.5 opacity-70">{icon}</span>}
      {label}
    </label>
    <div className={`w-full p-4 rounded-xl border transition-all duration-300 min-h-[120px] shadow-sm whitespace-pre-wrap leading-relaxed
      ${value 
        ? 'border-indigo-200 bg-white text-gray-900 ring-2 ring-indigo-50/50' 
        : 'border-gray-200 bg-gray-50/50 text-gray-400 italic font-normal'}`}>
      <span className="text-sm font-medium">
        {value || "AI will extract these details from your conversation..."}
      </span>
    </div>
  </div>
);

const InteractionForm = () => {
  const formData = useSelector((state) => state.interaction.formData);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold font-sans tracking-tight flex items-center">
          <Stethoscope className="mr-3" size={28} />
          Log HCP Interaction
        </h2>
        <p className="text-indigo-100 mt-1 text-sm font-medium">Fields are auto-filled by the AI Assistant</p>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-2 bg-slate-50/30">
        <SectionHeader title="Identification" icon={<Users size={14} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <ReadOnlyField label="HCP Name" value={formData.hcp_name} icon={<Users size={14} />} />
          <ReadOnlyField label="Interaction Type" value={formData.interaction_type} icon={<FileText size={14} />} />
          <ReadOnlyField label="Date" value={formData.date} icon={<Calendar size={14} />} />
          <ReadOnlyField label="Time" value={formData.time} icon={<Clock size={14} />} />
        </div>
        
        <ReadOnlyField 
          label="Attendees" 
          className="md:col-span-2"
          value={(Array.isArray(formData.attendees) && formData.attendees.length > 0) ? formData.attendees.join(", ") : ""} 
          icon={<Users size={14} />} 
        />
        
        <SectionHeader title="Discussion Details" icon={<FileText size={14} />} />
        <ReadOnlyTextarea label="Topics Discussed" value={formData.topics} icon={<FileText size={14} />} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <ReadOnlyField label="Materials Shared" value={formData.materials_shared} />
          <ReadOnlyField label="Samples Distributed" value={formData.samples_distributed} />
        </div>
        
        <SectionHeader title="Sentiment & Outcomes" icon={<CheckCircle size={14} />} />
        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-tight mb-4">HCP Sentiment</label>
          <div className="flex items-center justify-around md:justify-start md:space-x-12">
            <div className={`flex flex-col items-center space-y-2 transition-all p-2 rounded-lg ${formData.sentiment?.toLowerCase() === 'positive' ? 'bg-indigo-50/50 scale-110' : 'opacity-40'}`}>
              <Smile className={formData.sentiment?.toLowerCase() === 'positive' ? "text-indigo-600" : "text-gray-400"} size={28} />
              <span className={`text-[10px] font-bold uppercase ${formData.sentiment?.toLowerCase() === 'positive' ? 'text-indigo-700' : 'text-gray-500'}`}>Positive</span>
            </div>
            
            <div className={`flex flex-col items-center space-y-2 transition-all p-2 rounded-lg ${formData.sentiment?.toLowerCase() === 'neutral' ? 'bg-amber-50/50 scale-110' : 'opacity-40'}`}>
              <Meh className={formData.sentiment?.toLowerCase() === 'neutral' ? "text-amber-500" : "text-gray-400"} size={28} />
              <span className={`text-[10px] font-bold uppercase ${formData.sentiment?.toLowerCase() === 'neutral' ? 'text-amber-700' : 'text-gray-500'}`}>Neutral</span>
            </div>
            
            <div className={`flex flex-col items-center space-y-2 transition-all p-2 rounded-lg ${formData.sentiment?.toLowerCase() === 'negative' ? 'bg-red-50/50 scale-110' : 'opacity-40'}`}>
              <Frown className={formData.sentiment?.toLowerCase() === 'negative' ? "text-red-500" : "text-gray-400"} size={28} />
              <span className={`text-[10px] font-bold uppercase ${formData.sentiment?.toLowerCase() === 'negative' ? 'text-red-700' : 'text-gray-500'}`}>Negative</span>
            </div>
          </div>
        </div>
        
        <ReadOnlyTextarea label="Outcomes" value={formData.outcomes} icon={<CheckCircle size={14} />} />
        <ReadOnlyTextarea label="Follow-up Actions" value={formData.follow_up} icon={<Lightbulb size={14} />} />
      </div>
    </div>
  );
};

export default InteractionForm;
