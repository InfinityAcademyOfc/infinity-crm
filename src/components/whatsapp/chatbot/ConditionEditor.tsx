
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight, User, Timer, Calendar, Check, MessageCircle, Plus } from "lucide-react";

type ConditionType = "text" | "button" | "time" | "date" | "contact" | "custom";

interface Condition {
  id: string;
  type: ConditionType;
  name: string;
  description?: string;
  condition: string;
  value?: string;
  nextNodeId?: string;
}

const ConditionEditor = () => {
  const [conditions, setConditions] = useState<Condition[]>([
    {
      id: "condition-1",
      type: "text",
      name: "Contains Hello",
      condition: "msg.toLowerCase().includes('hello')",
      nextNodeId: "welcome-message"
    },
    {
      id: "condition-2",
      type: "text",
      name: "Contains Help",
      condition: "msg.toLowerCase().includes('help')",
      nextNodeId: "help-message"
    },
    {
      id: "condition-3",
      type: "time",
      name: "Business Hours",
      description: "Check if current time is within business hours",
      condition: "hour >= 9 && hour < 18 && day >= 1 && day <= 5",
      nextNodeId: "business-response"
    }
  ]);
  
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [newConditionType, setNewConditionType] = useState<ConditionType>("text");
  
  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      type: newConditionType,
      name: `New ${newConditionType} condition`,
      condition: ""
    };
    
    setConditions([...conditions, newCondition]);
    setSelectedCondition(newCondition);
  };
  
  const handleDeleteCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
    if (selectedCondition?.id === id) {
      setSelectedCondition(null);
    }
  };
  
  const handleUpdateCondition = (id: string, update: Partial<Condition>) => {
    setConditions(
      conditions.map(c => (c.id === id ? { ...c, ...update } : c))
    );
    
    if (selectedCondition?.id === id) {
      setSelectedCondition({ ...selectedCondition, ...update });
    }
  };
  
  const getConditionIcon = (type: ConditionType) => {
    switch (type) {
      case "text":
        return <MessageSquare size={16} />;
      case "button":
        return <MessageCircle size={16} />;
      case "time":
        return <Timer size={16} />;
      case "date":
        return <Calendar size={16} />;
      case "contact":
        return <User size={16} />;
      default:
        return <Check size={16} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Condition Types</h3>
          <Select value={newConditionType} onValueChange={(value) => setNewConditionType(value as ConditionType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Contains</SelectItem>
              <SelectItem value="button">Button Click</SelectItem>
              <SelectItem value="time">Time Based</SelectItem>
              <SelectItem value="date">Date Based</SelectItem>
              <SelectItem value="contact">Contact Property</SelectItem>
              <SelectItem value="custom">Custom Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mb-4 flex items-center justify-center gap-2"
          onClick={handleAddCondition}
        >
          <Plus size={16} />
          Add New Condition
        </Button>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Available Conditions</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div 
                  key={condition.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    selectedCondition?.id === condition.id 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCondition(condition)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {getConditionIcon(condition.type)}
                    </span>
                    <span className="font-medium text-sm">{condition.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7 opacity-0 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCondition(condition.id);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              
              {conditions.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No conditions created yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {selectedCondition ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Condition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={selectedCondition.name}
                  onChange={(e) => handleUpdateCondition(selectedCondition.id, { name: e.target.value })}
                  placeholder="Condition name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Input 
                  value={selectedCondition.description || ''}
                  onChange={(e) => handleUpdateCondition(selectedCondition.id, { description: e.target.value })}
                  placeholder="Brief description of what this condition does"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Tabs defaultValue="visual">
                  <TabsList className="mb-2">
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visual" className="space-y-4">
                    {selectedCondition.type === "text" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Text contains</label>
                        <Input 
                          value={selectedCondition.value || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const condition = `msg.toLowerCase().includes('${value.toLowerCase()}')`;
                            handleUpdateCondition(selectedCondition.id, { value, condition });
                          }}
                          placeholder="Text to match"
                        />
                      </div>
                    )}
                    
                    {selectedCondition.type === "time" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Start Time</label>
                            <Input type="time" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">End Time</label>
                            <Input type="time" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Days</label>
                          <div className="flex flex-wrap gap-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                              <label key={i} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded border-gray-300" defaultChecked={i > 0 && i < 6} />
                                <span>{day}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCondition.type === "contact" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Contact Property</label>
                          <Select defaultValue="name">
                            <SelectTrigger>
                              <SelectValue placeholder="Select property" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="tags">Tags</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Condition</label>
                          <Select defaultValue="contains">
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="startswith">Starts With</SelectItem>
                              <SelectItem value="endswith">Ends With</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Value</label>
                          <Input placeholder="Value to match" />
                        </div>
                      </div>
                    )}
                    
                    {/* For other condition types, provide appropriate UI */}
                    {(selectedCondition.type === "button" || 
                      selectedCondition.type === "date" || 
                      selectedCondition.type === "custom") && (
                      <div className="text-center py-6 text-muted-foreground">
                        Please use the Code tab to enter a custom condition.
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="code">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">JavaScript Condition Code</label>
                      <Textarea 
                        value={selectedCondition.condition}
                        onChange={(e) => handleUpdateCondition(selectedCondition.id, { condition: e.target.value })}
                        placeholder="Enter JavaScript condition code"
                        className="font-mono min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Available variables: msg, contact, username, hour, minute, day, date
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Redirect To Node</label>
                <Select 
                  value={selectedCondition.nextNodeId || ""} 
                  onValueChange={(value) => handleUpdateCondition(selectedCondition.id, { nextNodeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target node" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome-message">Welcome Message</SelectItem>
                    <SelectItem value="help-message">Help Message</SelectItem>
                    <SelectItem value="business-response">Business Hours Response</SelectItem>
                    <SelectItem value="after-hours-response">After Hours Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={() => {
                  // Save the condition
                  const updatedConditions = conditions.map(c => 
                    c.id === selectedCondition.id ? selectedCondition : c
                  );
                  setConditions(updatedConditions);
                }}>
                  Save Condition
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center p-12 border border-dashed rounded-lg">
            <div className="text-center">
              <MessageSquare size={36} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Condition Selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a condition from the list or create a new one to edit its properties.
              </p>
              <Button onClick={() => handleAddCondition()}>
                <Plus size={16} className="mr-2" /> Add New Condition
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionEditor;
