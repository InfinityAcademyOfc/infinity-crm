
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  action: string;
  target: string;
  time: string;
  user: string;
  avatar?: string;
  status?: string;
}

interface ActivitiesSectionProps {
  activities: Activity[];
}

const ActivitiesSection = ({ activities }: ActivitiesSectionProps) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    if (!activities || activities.length === 0) return;
    
    // Prepare CSV content
    const headers = ["ID", "Ação", "Alvo", "Hora", "Usuário", "Status"];
    const rows = activities.map(activity => [
      activity.id,
      activity.action,
      activity.target,
      activity.time,
      activity.user,
      activity.status || ""
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `atividades-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados de atividades foram exportados em formato CSV",
      duration: 2000 // Reduced to 2 seconds
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações realizadas hoje</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download size={16} />
          Exportar CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Não há atividades registradas hoje.
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user} <span className="text-muted-foreground">realizou</span> {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.target} • {activity.time}
                  </p>
                </div>
                {activity.status && (
                  <div className="ml-auto">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {activity.status === "completed"
                        ? "Concluído"
                        : activity.status === "pending"
                        ? "Pendente"
                        : "Atrasado"}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitiesSection;
