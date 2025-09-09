import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3 } from "lucide-react";

interface ExpenseCardProps {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard = ({ 
  id, 
  category, 
  amount, 
  date, 
  description, 
  onEdit, 
  onDelete 
}: ExpenseCardProps) => {
  return (
    <Card className="p-4 mb-3 bg-expense-bg border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{category}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
          )}
          <div className="text-2xl font-bold text-destructive">
            -${amount.toFixed(2)}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};