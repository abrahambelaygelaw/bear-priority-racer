import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Task {
  name: string;
  priority: number;
}

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isSelected, 
  onSelect, 
  disabled 
}) => {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 hover:scale-105",
        "bg-gradient-to-br from-card to-card-hover",
        "border-2 hover:border-primary/50",
        "shadow-lg hover:shadow-xl",
        isSelected && "ring-2 ring-primary ring-offset-2 animate-glow",
        disabled && !isSelected && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-warning flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">
          {task.name}
        </h3>
        
        <div className="text-sm text-muted-foreground">
          Click to select this task
        </div>

        {isSelected && (
          <div className="mt-4 animate-bounce-in">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
              Selected!
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};