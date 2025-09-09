import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface BalanceCardProps {
  monthlyIncome: number;
  totalExpenses: number;
  remainingBalance: number;
}

export const BalanceCard = ({ monthlyIncome, totalExpenses, remainingBalance }: BalanceCardProps) => {
  const isPositive = remainingBalance >= 0;
  
  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg animate-bounce-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Monthly Overview
        </h2>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-success-foreground" />
        ) : (
          <TrendingDown className="h-6 w-6 text-warning-foreground" />
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm opacity-90 mb-1">Monthly Income</p>
          <p className="text-2xl font-bold">${monthlyIncome.toFixed(2)}</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-90 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-warning-foreground">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-90 mb-1">Remaining</p>
          <p className={`text-3xl font-bold ${
            isPositive ? 'text-success-foreground' : 'text-destructive-foreground'
          }`}>
            ${remainingBalance.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};