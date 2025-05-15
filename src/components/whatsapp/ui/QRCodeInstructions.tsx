import { ScanLine, Smartphone, CheckCircle } from "lucide-react";

const QRCodeInstructions = () => (
  <div className="mb-6 text-center">
    <h3 className="text-xl font-medium mb-4 text-[#075e54]">
      Use o WhatsApp no seu CRM
    </h3>

    <div className="flex flex-col md:flex-row justify-center gap-4 text-center mb-4">
      {[
        {
          icon: <Smartphone size={20} className="text-[#075e54]" />,
          text: "Abra o WhatsApp no seu telefone",
        },
        {
          icon: <ScanLine size={20} className="text-[#075e54]" />,
          text: "Toque em Menu ou Configurações e selecione WhatsApp Web",
        },
        {
          icon: <CheckCircle size={20} className="text-[#075e54]" />,
          text: "Aponte seu telefone para esta tela para capturar o código",
        },
      ].map(({ icon, text }, index) => (
        <div key={index} className="flex flex-col items-center max-w-[160px] mx-auto">
          <div className="w-10 h-10 rounded-full bg-[#e9edef] flex items-center justify-center mb-2">
            {icon}
          </div>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  </div>
);

export default QRCodeInstructions;
