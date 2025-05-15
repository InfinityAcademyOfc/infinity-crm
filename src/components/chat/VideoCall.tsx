import { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VideoCallProps {
  isOpen?: boolean;
  onClose: () => void;
  onEndCall?: () => void;
}

const VideoCall = ({ isOpen = false, onClose, onEndCall }: VideoCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const { toast } = useToast();
  
  // Simulate the time passing in the call
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the call time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const handleEndCall = () => {
    toast({
      title: "Chamada finalizada",
      description: `Duração: ${formatTime(callTime)}`
    });
    onClose();
    if (onEndCall) {
      onEndCall();
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microfone ativado" : "Microfone desativado"
    });
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Câmera desativada" : "Câmera ativada"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-gray-900 relative rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {isVideoOn ? (
            <iframe 
              src="https://meet.jit.si/InfinityCRM" 
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full border-0"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center flex-col">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Users size={48} className="text-gray-400" />
              </div>
              <p className="text-white text-lg">Câmera desativada</p>
            </div>
          )}
        </div>
        
        <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
          {formatTime(callTime)}
        </div>
      </div>
      
      <div className="p-4 bg-gray-800 rounded-b-lg flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="text-white" /> : <VideoOff className="text-white" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-red-500 hover:bg-red-600"
          onClick={handleEndCall}
        >
          <PhoneOff className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
