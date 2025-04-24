import React from "react";
import { Fuel, FileText, Star, Heart, Clock, Rocket, Trophy, Smile, Award } from "lucide-react";
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
        <polygon points="0,0 36,0 26,14 26,23 10,23 10,14" fill="#F97316" stroke="#d97706" strokeWidth="2" />
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
      </svg>
    ),
  },
  {
    id: "star",
    name: "Estrela",
    shape: "star",
    color: "#FACC15",
    icon: <Star />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <polygon points="16,3 20,13 31,13 22,19 25,29 16,23 7,29 10,19 1,13 12,13" fill="#FACC15" stroke="#bcb318" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "heart",
    name: "Coração",
    shape: "heart",
    color: "#EF4444",
    icon: <Heart />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path d="M23.6,4.6c-2.3,0-4.3,1.5-5.6,3.1C16.7,6.1,14.7,4.6,12.4,4.6C8.4,4.6,5,8,5,12c0,7,11,15,11,15s11-8,11-15C27,8,23.6,4.6,23.6,4.6z" fill="#EF4444" stroke="#bb253e" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "clock",
    name: "Relógio",
    shape: "clock",
    color: "#0EA5E9",
    icon: <Clock />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#0EA5E9" stroke="#0369a1" strokeWidth="2" />
        <line x1="16" y1="16" x2="16" y2="8" stroke="#fff" strokeWidth="2"/>
        <line x1="16" y1="16" x2="22" y2="16" stroke="#fff" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "rocket",
    name: "Foguete",
    shape: "rocket",
    color: "#8B5CF6",
    icon: <Rocket />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 2 C20 8, 28 8, 16 30 C4 8, 12 8, 16 2 Z" fill="#8B5CF6" stroke="#4b1b9a" strokeWidth="2"/>
        <circle cx="16" cy="12" r="3" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "trophy",
    name: "Troféu",
    shape: "trophy",
    color: "#FFD700",
    icon: <Trophy />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="12" y="22" width="8" height="4" fill="#FFD700" />
        <rect x="10" y="26" width="12" height="2" fill="#b3a125"/>
        <ellipse cx="16" cy="16" rx="10" ry="8" fill="#FFD700" stroke="#b3a125" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "smile",
    name: "Emoji",
    shape: "emoji",
    color: "#FDE68A",
    icon: <Smile />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#facc15" />
        <ellipse cx="11" cy="14" rx="2" ry="3" fill="#000" />
        <ellipse cx="21" cy="14" rx="2" ry="3" fill="#000" />
        <path d="M11 22 Q16 26 21 22" stroke="#000" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "award",
    name: "Medalha",
    shape: "award",
    color: "#EAB308",
    icon: <Award />,
    renderContent: () => (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="10" fill="#EAB308" />
        <rect x="14" y="26" width="4" height="8" fill="#c29404" />
      </svg>
    ),
  }
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
