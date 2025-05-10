
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  User, 
  MessageCircle,
  PlusCircle
} from "lucide-react";

const ConditionEditor = () => {
  const [conditions, setConditions] = useState([
    { type: "message", value: "hello", operator: "contains" },
  ]);

  const addCondition = (type: string) => {
    setConditions([...conditions, { type, value: "", operator: "contains" }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: string, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Condition Editor</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Create conditions to trigger different responses based on message content, user attributes, or timing.
        </p>
      </div>

      <Tabs defaultValue="message-conditions" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="message-conditions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Message
          </TabsTrigger>
          <TabsTrigger value="user-conditions" className="flex items-center gap-2">
            <User className="h-4 w-4" /> User
          </TabsTrigger>
          <TabsTrigger value="timing-conditions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Timing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="message-conditions">
          <div className="space-y-4">
            {conditions.filter(c => c.type === "message").map((condition, index) => (
              <div key={index} className="p-4 border rounded-md bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`condition-${index}-operator`} className="mb-2 block">
                      Operator
                    </Label>
                    <select
                      id={`condition-${index}-operator`}
                      className="w-full p-2 border rounded-md"
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, "operator", e.target.value)}
                    >
                      <option value="contains">Contains</option>
                      <option value="starts-with">Starts With</option>
                      <option value="ends-with">Ends With</option>
                      <option value="equals">Equals</option>
                      <option value="regex">Regex Match</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`condition-${index}-value`} className="mb-2 block">
                      Value
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`condition-${index}-value`}
                        type="text"
                        placeholder="Enter keyword or pattern"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeCondition(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => addCondition("message")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Message Condition
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="user-conditions">
          <div className="space-y-4">
            {conditions.filter(c => c.type === "user").map((condition, index) => (
              <div key={index} className="p-4 border rounded-md bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`user-condition-${index}-attribute`} className="mb-2 block">
                      Attribute
                    </Label>
                    <select
                      id={`user-condition-${index}-attribute`}
                      className="w-full p-2 border rounded-md"
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, "operator", e.target.value)}
                    >
                      <option value="is-new">Is New Contact</option>
                      <option value="has-tag">Has Tag</option>
                      <option value="in-list">In List</option>
                      <option value="last-message">Last Message Time</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`user-condition-${index}-value`} className="mb-2 block">
                      Value
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`user-condition-${index}-value`}
                        type="text"
                        placeholder="Enter value"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeCondition(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => addCondition("user")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add User Condition
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="timing-conditions">
          <div className="space-y-4">
            {conditions.filter(c => c.type === "timing").map((condition, index) => (
              <div key={index} className="p-4 border rounded-md bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`timing-condition-${index}-type`} className="mb-2 block">
                      Time Condition
                    </Label>
                    <select
                      id={`timing-condition-${index}-type`}
                      className="w-full p-2 border rounded-md"
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, "operator", e.target.value)}
                    >
                      <option value="time-of-day">Time of Day</option>
                      <option value="day-of-week">Day of Week</option>
                      <option value="after-hours">After Hours</option>
                      <option value="business-hours">Business Hours</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`timing-condition-${index}-value`} className="mb-2 block">
                      Value
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`timing-condition-${index}-value`}
                        type="text"
                        placeholder="Enter timing value"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeCondition(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => addCondition("timing")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Timing Condition
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t pt-4">
        <Button className="w-full">Save Conditions</Button>
      </div>
    </div>
  );
};

export default ConditionEditor;
