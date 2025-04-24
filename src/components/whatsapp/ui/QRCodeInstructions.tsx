
import { ScanLine, Smartphone, CheckCircle } from "lucide-react";

const QRCodeInstructions = () => (
  <div className="mb-6 text-center">
    <h3 className="text-xl font-medium mb-4 text-[#075e54]">Use o WhatsApp no seu CRM</h3>
    <div className="flex flex-col md:flex-row justify-center gap-4 text-center mb-4">
      <div className="flex flex-col items-center max-w-[160px] mx-auto">
        <div className="w-10 h-10 rounded-full bg-[#e9edef] flex items-center justify-center mb-2">
          <Smartphone size={20} className="text-[#075e54]" />
        </div>
        <p className="text-sm text-muted-foreground">
          Abra o WhatsApp no seu telefone
        </p>
      </div>
      
      <div className="flex flex-col items-center max-w-[160px] mx-auto">
        <div className="w-10 h-10 rounded-full bg-[#e9edef] flex items-center justify-center mb-2">
          <ScanLine size={20} className="text-[#075e54]" />
        </div>
        <p className="text-sm text-muted-foreground">
          Toque em Menu ou Configurações e selecione WhatsApp Web
        </p>
      </div>
      
      <div className="flex flex-col items-center max-w-[160px] mx-auto">
        <div className="w-10 h-10 rounded-full bg-[#e9edef] flex items-center justify-center mb-2">
          <CheckCircle size={20} className="text-[#075e54]" />
        </div>
        <p className="text-sm text-muted-foreground">
          Aponte seu telefone para esta tela para capturar o código
        </p>
      </div>
    </div>
  </div>
);

export default QRCodeInstructions;
