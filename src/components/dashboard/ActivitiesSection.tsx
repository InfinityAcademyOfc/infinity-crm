
import { useState } from "react";
import { Check, Clock, Calendar, Filter, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: string;
  title: string;
  time?: string;
  relatedTo?: string;
  status?: string; // Optional to match mockData
  priority?: string;
}

interface ActivitiesSectionProps {
  activities: Activity[];
}

const ActivitiesSection = ({ activities }: ActivitiesSectionProps) => {
  const [activeTab, setActiveTab] = useState("today");

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Check size={14} className="text-blue-500" />;
      case 'meeting':
        return <Calendar size={14} className="text-purple-500" />;
      case 'deadline':
        return <Clock size={14} className="text-red-500" />;
      case 'note':
        return <Filter size={14} className="text-gray-500" />;
      default:
        return null;
    }
  };
  
  const renderPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    };
    
    return (
      <Badge variant="outline" className={`${colors[priority]} ml-2`}>
        {priority}
      </Badge>
    );
  };

  // Filter activities based on active tab
  const filteredActivities = activities.filter(activity => {
    if (activeTab === "today") return true;
    if (activeTab === "upcoming") return activity.status === "pending";
    if (activeTab === "overdue") return activity.status === "overdue";
    return false;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl">Atividades</CardTitle>
          <Tabs defaultValue="today" className="w-auto" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="today">Hoje</TabsTrigger>
              <TabsTrigger value="upcoming">Próximas</TabsTrigger>
              <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" value={activeTab} className="w-full">
          <TabsContent value="today" className="mt-0">
            <div className="space-y-4">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="flex items-start p-3 rounded-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-3">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</h4>
                      {renderPriorityBadge(activity.priority)}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.time && <span className="mr-2">{activity.time}</span>}
                      {activity.relatedTo && <span>• {activity.relatedTo}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-0">
            <div className="space-y-4">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="flex items-start p-3 rounded-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-3">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</h4>
                      {renderPriorityBadge(activity.priority)}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.time && <span className="mr-2">{activity.time}</span>}
                      {activity.relatedTo && <span>• {activity.relatedTo}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="overdue" className="mt-0">
            <div className="space-y-4">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="flex items-start p-3 rounded-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-3">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</h4>
                      {renderPriorityBadge(activity.priority)}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.time && <span className="mr-2">{activity.time}</span>}
                      {activity.relatedTo && <span>• {activity.relatedTo}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="gap-2">
            <Clock size={16} />
            Ver Todas as Atividades
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitiesSection;
