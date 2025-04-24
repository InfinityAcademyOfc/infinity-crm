
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MeetingItem from "./MeetingItem";

// Import table row type for tasks
import type { Tables } from "@/integrations/supabase/types";

const MeetingsList = () => {
  const [meetings, setMeetings] = useState<Tables<"tasks">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true);
      // Fetch "meeting" tasks from tasks table
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "meeting");
      setMeetings(data || []);
      setLoading(false);
    }
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span>Carregando reuniões...</span>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Ainda não há dados suficientes. Adicione para ver os resultados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reuniões Agendadas</h2>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Nova Reunião
        </Button>
      </div>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-4 bg-muted rounded shadow"
          >
            <div className="font-semibold">{meeting.name}</div>
            <div className="text-sm text-muted-foreground">{meeting.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsList;
