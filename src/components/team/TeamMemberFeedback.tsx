
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star, Send } from "lucide-react";

interface TeamMemberFeedbackProps {
  member: {
    id: string | number;
    name: string;
    email: string;
    role: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamMemberFeedback = ({ member, open, onOpenChange }: TeamMemberFeedbackProps) => {
  const [feedbackType, setFeedbackType] = useState("performance");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("3");
  const { toast } = useToast();

  const handleSubmit = () => {
    // Here we would typically save the feedback to a database
    // For now, we'll just show a toast notification
    toast({
      title: "Feedback enviado",
      description: `Feedback enviado para ${member.name}`,
    });
    
    // Reset form
    setFeedback("");
    setRating("3");
    setFeedbackType("performance");
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Enviar Feedback
          </DialogTitle>
          <DialogDescription>
            Forneça feedback para {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback-type">Tipo de Feedback</Label>
            <Select
              value={feedbackType}
              onValueChange={setFeedbackType}
            >
              <SelectTrigger id="feedback-type">
                <SelectValue placeholder="Selecione o tipo de feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Desempenho</SelectItem>
                <SelectItem value="skills">Habilidades</SelectItem>
                <SelectItem value="behavior">Comportamento</SelectItem>
                <SelectItem value="project">Projeto Específico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rating">Avaliação</Label>
            <div className="flex items-center gap-2">
              <Select
                value={rating}
                onValueChange={setRating}
              >
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Selecione uma avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Precisa melhorar</SelectItem>
                  <SelectItem value="2">2 - Regular</SelectItem>
                  <SelectItem value="3">3 - Bom</SelectItem>
                  <SelectItem value="4">4 - Muito Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${parseInt(rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="feedback">Detalhes do Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Descreva seu feedback detalhadamente..."
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="gap-1">
            <Send className="h-4 w-4" /> Enviar Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberFeedback;
