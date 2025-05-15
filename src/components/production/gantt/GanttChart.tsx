
import { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, getDay, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  code: string;
  title: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dependencies?: string[];
}

const initialTasks: Task[] = [
  {
    id: "task-1",
    code: "TBT-32",
    title: "Build start date",
    startDate: new Date(2022, 9, 20),
    endDate: new Date(2022, 9, 22),
    completed: true,
  },
  {
    id: "task-2",
    code: "TBT-10",
    title: "Register domain",
    startDate: new Date(2022, 7, 1),
    endDate: new Date(2022, 7, 20),
    completed: true,
    assignee: {
      id: "user-1",
      name: "Ana Silva",
      avatar: "/avatar-placeholder.jpg"
    }
  },
  {
    id: "task-3",
    code: "TBT-35",
    title: "Plan website layout",
    startDate: new Date(2022, 7, 20),
    endDate: new Date(2022, 8, 10),
    completed: true,
    assignee: {
      id: "user-2",
      name: "Carlos Souza",
      avatar: "/avatar-placeholder.jpg"
    }
  },
  {
    id: "task-4",
    code: "TBT-11",
    title: "Create main page visuals",
    startDate: new Date(2022, 7, 25),
    endDate: new Date(2022, 8, 5),
    completed: true,
  },
  {
    id: "task-5",
    code: "TBT-12",
    title: "Organize webhosting",
    startDate: new Date(2022, 8, 5),
    endDate: new Date(2022, 8, 15),
    completed: true,
    assignee: {
      id: "user-3",
      name: "Maria Oliveira",
      avatar: "/avatar-placeholder.jpg"
    },
    dependencies: ["task-2"]
  },
  {
    id: "task-6",
    code: "TBT-35",
    title: "Contact vendor",
    startDate: new Date(2022, 8, 8),
    endDate: new Date(2022, 8, 10),
    completed: false,
  },
  {
    id: "task-7",
    code: "TBT-14",
    title: "Trip delivery",
    startDate: new Date(2022, 8, 12),
    endDate: new Date(2022, 8, 14),
    completed: false,
    assignee: {
      id: "user-2",
      name: "Carlos Souza",
      avatar: "/avatar-placeholder.jpg"
    }
  },
  {
    id: "task-8",
    code: "TBT-33",
    title: "Trip planning",
    startDate: new Date(2022, 8, 15),
    endDate: new Date(2022, 8, 20),
    completed: false,
    assignee: {
      id: "user-1",
      name: "Ana Silva",
      avatar: "/avatar-placeholder.jpg"
    }
  },
  {
    id: "task-9",
    code: "TBT-14",
    title: "As a user I can share content",
    startDate: new Date(2022, 8, 20),
    endDate: new Date(2022, 9, 3),
    completed: false,
    assignee: {
      id: "user-3",
      name: "Maria Oliveira",
      avatar: "/avatar-placeholder.jpg"
    }
  },
  {
    id: "task-10",
    code: "TBT-13",
    title: "License renewal for dev tools",
    startDate: new Date(2022, 8, 1),
    endDate: new Date(2022, 9, 10),
    completed: false,
    assignee: {
      id: "user-1",
      name: "Ana Silva",
      avatar: "/avatar-placeholder.jpg"
    }
  }
];

const GanttChart = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 9, 1)); // October 2022 from the image
  const [tasks, setTasks] = useState(initialTasks);
  const [visibleTasks, setVisibleTasks] = useState(tasks);
  const [searchQuery, setSearchQuery] = useState("");
  
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Handle navigation
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());
  
  // Filter tasks based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setVisibleTasks(filtered);
    } else {
      setVisibleTasks(tasks);
    }
  }, [searchQuery, tasks]);
  
  // Calculate task position
  const getTaskPosition = (task: Task) => {
    if (!isWithinInterval(task.startDate, { start: startDate, end: endDate }) && 
        !isWithinInterval(task.endDate, { start: startDate, end: endDate })) {
      return null;
    }
    
    const taskStartDate = task.startDate < startDate ? startDate : task.startDate;
    const taskEndDate = task.endDate > endDate ? endDate : task.endDate;
    
    // Calculate start and width percentages
    const totalDays = days.length;
    const startDay = taskStartDate.getDate() - 1; // 0-based index
    const daysDuration = Math.ceil((taskEndDate.getTime() - taskStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Percentage calculations
    const startPercentage = (startDay / totalDays) * 100;
    const widthPercentage = (daysDuration / totalDays) * 100;
    
    return {
      left: `${startPercentage}%`,
      width: `${widthPercentage}%`,
      task,
    };
  };
  
  // Draw dependency lines
  const getDependencyLines = () => {
    return tasks.filter(task => task.dependencies && task.dependencies.length > 0)
      .map(task => {
        return task.dependencies?.map(depId => {
          const dependency = tasks.find(t => t.id === depId);
          if (!dependency) return null;
          
          const depPos = getTaskPosition(dependency);
          const taskPos = getTaskPosition(task);
          
          if (!depPos || !taskPos) return null;
          
          // Calculate positions for SVG path
          const depEndX = parseFloat(depPos.left) + parseFloat(depPos.width);
          const taskStartX = parseFloat(taskPos.left);
          
          const curveX = (taskStartX - depEndX) / 2;
          
          return (
            <svg
              key={`${dependency.id}-${task.id}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <path
                d={`M ${depEndX}% 50% C ${depEndX + curveX}% 50%, ${taskStartX - curveX}% 50%, ${taskStartX}% 50%`}
                stroke="red"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="red" />
                </marker>
              </defs>
            </svg>
          );
        });
      });
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border rounded-md overflow-hidden" style={{ height: '842px' }}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">The Next Big Thing</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="border rounded-md px-3 py-1 text-sm w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1 border rounded-md">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2" 
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm px-2">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2" 
              onClick={handleNextMonth}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="h-8">
            <Calendar size={14} className="mr-1" />
            Today
          </Button>
          
          <Button variant="outline" size="sm" className="h-8">
            Filter
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Task list column */}
          <div className="w-64 min-w-64 border-r bg-gray-50 dark:bg-gray-900">
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b p-3">
              <h3 className="font-medium">Task</h3>
            </div>
            <div>
              {visibleTasks.map(task => (
                <div 
                  key={task.id} 
                  className="p-3 border-b hover:bg-gray-100 dark:hover:bg-gray-800 flex items-start"
                >
                  <div className="mr-2 mt-1">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {
                        const updatedTasks = tasks.map(t => 
                          t.id === task.id ? {...t, completed: !t.completed} : t
                        );
                        setTasks(updatedTasks);
                      }}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded px-1.5 py-0.5 mr-1">
                        {task.code}
                      </div>
                    </div>
                    <div className="text-sm truncate">{task.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gantt chart grid */}
          <div className="flex-1 overflow-x-auto">
            {/* Header with dates */}
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b">
              <div className="flex">
                {days.map((day, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex-1 min-w-[30px] p-3 text-center text-xs border-r last:border-r-0",
                      getDay(day) === 0 || getDay(day) === 6 ? 'bg-gray-100 dark:bg-gray-800' : ''
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tasks timeline */}
            <div className="relative">
              {/* Vertical grid lines for days */}
              <div className="absolute inset-0 flex pointer-events-none">
                {days.map((day, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex-1 min-w-[30px] border-r last:border-r-0",
                      getDay(day) === 0 || getDay(day) === 6 ? 'bg-gray-100/50 dark:bg-gray-800/30' : ''
                    )}
                  />
                ))}
              </div>
              
              {/* Task bars */}
              {visibleTasks.map(task => {
                const position = getTaskPosition(task);
                if (!position) return null;
                
                return (
                  <div 
                    key={task.id}
                    className="h-[54px] border-b relative"
                  >
                    <div
                      className={cn(
                        "absolute top-2 h-8 rounded-md z-10",
                        task.completed ? 'bg-green-500' : 'bg-blue-500'
                      )}
                      style={{
                        left: position.left,
                        width: position.width,
                      }}
                    >
                      <div className="px-2 py-1 text-white text-xs truncate flex items-center h-full">
                        {task.completed && <Check size={14} className="mr-1" />}
                        {task.title}
                      </div>
                      
                      {/* Avatar if assigned */}
                      {task.assignee && (
                        <div 
                          className="absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 p-0.5"
                        >
                          <img 
                            src={task.assignee.avatar || "/avatar-placeholder.jpg"} 
                            alt={task.assignee.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Dependency lines */}
              <div className="absolute inset-0 pointer-events-none">
                {getDependencyLines()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
