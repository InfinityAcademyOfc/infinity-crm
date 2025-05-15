import React from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Heading1, Heading2, Heading3, Link, Code, Image, List, ListOrdered, Quote,
  Type 
} from 'lucide-react';

const fontsList = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Playfair Display", value: '"Playfair Display", serif' },
  { label: "DM Sans", value: '"DM Sans", sans-serif' },
  { label: "Oswald", value: "Oswald, sans-serif" },
  { label: "Lobster", value: '"Lobster", cursive' }
];
const colorsList = [
  "#000000", "#333333", "#dd0000", "#1a8917", "#0070f3", "#A259FF", "#FFB800", "#ee82ee",
  "#f97316", "#64d8cb", "#f87171", "#fbbf24", "#84cc16", "#38bdf8", "#e879f9"
];
const sizesList = ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "40px"];

interface FloatingFormatToolbarProps {
  position: {
    top: number;
    left: number;
  };
  onFormatAction: (action: string, value?: string) => void;
}

const FloatingFormatToolbar: React.FC<FloatingFormatToolbarProps> = ({ position, onFormatAction }) => {
  const calculatePosition = () => {
    const viewportWidth = window.innerWidth;
    const toolbarWidth = 325;
    
    let left = position.left;
    if (left - (toolbarWidth / 2) < 0) {
      left = toolbarWidth / 2;
    } else if (left + (toolbarWidth / 2) > viewportWidth) {
      left = viewportWidth - (toolbarWidth / 2);
    }
    
    return {
      top: `${Math.max(10, position.top)}px`,
      left: `${left}px`,
    };
  };

  const positionStyle = calculatePosition();
  
  return (
    <div 
      className="floating-format-toolbar fixed z-50 bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-700"
      style={{
        ...positionStyle,
        transform: 'translate(-50%, -100%)',
        minWidth: 325,
        borderRadius: 9,
        boxShadow: "0 8px 28px -3px rgb(0 0 0 / .25)",
      }}
    >
      {/* Estilos */}
      <button onClick={() => onFormatAction('bold')} className="p-1 text-white hover:bg-gray-700 rounded"><Bold size={17} /></button>
      <button onClick={() => onFormatAction('italic')} className="p-1 text-white hover:bg-gray-700 rounded"><Italic size={17} /></button>
      <button onClick={() => onFormatAction('underline')} className="p-1 text-white hover:bg-gray-700 rounded"><Underline size={17} /></button>
      <button onClick={() => onFormatAction('strikeThrough')} className="p-1 text-white hover:bg-gray-700 rounded"><Strikethrough size={17} /></button>
      {/* Cores */}
      <div className="flex items-center ml-1 mr-1">
        <select className="rounded text-xs bg-gray-700 text-white px-1 py-0.5" style={{width: 34}} onChange={e => onFormatAction('foreColor', e.target.value)}>
          {colorsList.map((c,i) => <option key={i} value={c} style={{background:c, color:"#fff"}}>{""}</option>)}
        </select>
        <select className="rounded text-xs bg-gray-700 text-white px-1 py-0.5 ml-1" style={{width: 34}} onChange={e => onFormatAction('backColor', e.target.value)}>
          {colorsList.map((c,i) => <option key={i} value={c} style={{background:c, color:"#fff"}}>{""}</option>)}
        </select>
      </div>
      {/* Fontes */}
      <select className="rounded text-xs bg-gray-700 text-white px-1 py-0.5 mr-1" style={{minWidth:85}} onChange={e => onFormatAction('fontName', e.target.value)}>
        {fontsList.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      {/* Tamanho */}
      <select className="rounded text-xs bg-gray-700 text-white px-1 py-0.5 w-16" onChange={e => onFormatAction('fontSize', e.target.value.replace("px",""))}>
        {sizesList.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Blocos/heading */}
      <button onClick={() => onFormatAction('formatBlock', '<h1>')} className="p-1 text-white hover:bg-gray-700 rounded"><Heading1 size={16}/></button>
      <button onClick={() => onFormatAction('formatBlock', '<h2>')} className="p-1 text-white hover:bg-gray-700 rounded"><Heading2 size={15}/></button>
      <button onClick={() => onFormatAction('formatBlock', '<h3>')} className="p-1 text-white hover:bg-gray-700 rounded"><Heading3 size={14}/></button>
      {/* alinhamento */}
      <button onClick={() => onFormatAction('justifyLeft')} className="p-1 text-white hover:bg-gray-700 rounded"><AlignLeft size={16}/></button>
      <button onClick={() => onFormatAction('justifyCenter')} className="p-1 text-white hover:bg-gray-700 rounded"><AlignCenter size={16}/></button>
      <button onClick={() => onFormatAction('justifyRight')} className="p-1 text-white hover:bg-gray-700 rounded"><AlignRight size={16}/></button>
      <button onClick={() => onFormatAction('justifyFull')} className="p-1 text-white hover:bg-gray-700 rounded"><AlignJustify size={16}/></button>
      {/* listas */}
      <button onClick={() => onFormatAction('insertUnorderedList')} className="p-1 text-white hover:bg-gray-700 rounded"><List size={15}/></button>
      <button onClick={() => onFormatAction('insertOrderedList')} className="p-1 text-white hover:bg-gray-700 rounded"><ListOrdered size={15}/></button>
      {/* Quote/code/link/img */}
      <button onClick={() => onFormatAction('formatBlock', '<blockquote>')} className="p-1 text-white hover:bg-gray-700 rounded"><Quote size={14}/></button>
      <button onClick={() => onFormatAction('formatBlock', '<pre>')} className="p-1 text-white hover:bg-gray-700 rounded"><Code size={14}/></button>
      <button onClick={() => {
        const url = prompt('URL da imagem:');
        if (url) onFormatAction('insertImage', url);
      }} className="p-1 text-white hover:bg-gray-700 rounded"><Image size={14}/></button>
      <button onClick={() => {
        const url = prompt('URL do link:');
        if (url) onFormatAction('createLink', url);
      }} className="p-1 text-white hover:bg-gray-700 rounded"><Link size={15}/></button>
    </div>
  );
};

export default FloatingFormatToolbar;
