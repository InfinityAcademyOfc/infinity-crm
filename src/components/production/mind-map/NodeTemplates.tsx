
import React from "react";
import { Fuel, FileText } from "lucide-react";
import { Node } from 'reactflow';

export const nodeTemplates = [
  {
    id: "funnel",
    name: "Funil",
    shape: "funnel",
    color: "#F97316",
    icon: <Fuel />,
    renderContent: () => (
      <svg width="36" height="24" viewBox="0 0 36 24">
        <path d="M2,0 L34,0 L28,14 L28,23 L8,23 L8,14 Z" fill="#F97316" stroke="#d97706" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "note",
    name: "Bloco de Notas",
    shape: "notepad",
    color: "#FDE1D3",
    icon: <FileText />,
    renderContent: () => (
      <svg width="32" height="24" viewBox="0 0 32 24">
        <rect x="2" y="2" width="28" height="20" rx="4" fill="#FDE1D3" stroke="#db9c5e" strokeWidth="2"/>
        <line x1="8" y1="8" x2="24" y2="8" stroke="#db9c5e" strokeWidth="1"/>
        <line x1="8" y1="12" x2="24" y2="12" stroke="#db9c5e" strokeWidth="1"/>
        <line x1="8" y1="16" x2="20" y2="16" stroke="#db9c5e" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: "highlight",
    name: "Linha de escrita",
    shape: "highlight",
    color: "#FEF7CD",
    icon: <FileText />,
    renderContent: () => (
      <svg width="32" height="24" viewBox="0 0 32 24">
        <rect x="2" y="8" width="28" height="8" fill="#FEF7CD" stroke="#E5AC00" strokeWidth="1"/>
        <line x1="4" y1="12" x2="28" y2="12" stroke="#E5AC00" strokeWidth="1" strokeDasharray="2,2"/>
      </svg>
    ),
  },
];

const NodeTemplates = ({ templates = nodeTemplates, onAddTemplate }) => (
  <div className="flex flex-wrap gap-3">
    {templates.map(template => (
      <button 
        key={template.id}
        type="button"
        className="flex flex-col items-center justify-center gap-1 hover:bg-accent rounded p-2 border"
        onClick={() => onAddTemplate && onAddTemplate(template)}
        title={template.name}
      >
        <div>
          {template.renderContent()}
        </div>
        <span className="text-xs">{template.name}</span>
      </button>
    ))}
  </div>
);

export default NodeTemplates;
