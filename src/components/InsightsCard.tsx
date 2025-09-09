import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, DollarSign, PieChart } from "lucide-react";

interface InsightsCardProps {
  expenses: Array<{
    id: string;
    category: string;
    amount: number;
    date: string;
    description?: string;
  }>;
}

export const InsightsCard = ({ expenses }: InsightsCardProps) => {
  const now = new Date();
  
  // Calculate insights
  const thisMonth = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });
  
  const lastMonth = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return expenseDate.getMonth() === lastMonthDate.getMonth() && 
           expenseDate.getFullYear() === lastMonthDate.getFullYear();
  });
  
  const thisYear = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getFullYear() === now.getFullYear();
  });
  
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);
  const thisYearTotal = thisYear.reduce((sum, e) => sum + e.amount, 0);
  
  // Category breakdown for current month
  const categoryTotals = thisMonth.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  const monthlyChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  return (
    <Card className="p-6 mb-6 animate-bounce-in">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Spending Insights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time-based insights */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            Time Periods
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">This Month</span>
              <span className="font-semibold text-lg">${thisMonthTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Month</span>
              <span className="font-semibold">${lastMonthTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">This Year</span>
              <span className="font-semibold text-primary">${thisYearTotal.toFixed(2)}</span>
            </div>
            
            {lastMonthTotal > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <TrendingUp className={`h-4 w-4 ${monthlyChange > 0 ? 'text-destructive' : 'text-success'}`} />
                <span className={`text-sm font-medium ${monthlyChange > 0 ? 'text-destructive' : 'text-success'}`}>
                  {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}% vs last month
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Category breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <DollarSign className="h-4 w-4" />
            Top Categories (This Month)
          </div>
          
          <div className="space-y-3">
            {topCategories.length > 0 ? (
              topCategories.map(([category, amount], index) => {
                const percentage = thisMonthTotal > 0 ? (amount / thisMonthTotal) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-primary' : 
                          index === 1 ? 'bg-accent' : 'bg-muted-foreground'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No expenses this month yet</p>
            )}
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-2">Quick Stats</div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Expenses</span>
              <span className="font-semibold">{expenses.length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg per Expense</span>
              <span className="font-semibold">
                ${expenses.length > 0 ? (expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toFixed(2) : '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Categories Used</span>
              <span className="font-semibold">{Object.keys(categoryTotals).length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Daily Avg (Month)</span>
              <span className="font-semibold">
                ${thisMonth.length > 0 ? (thisMonthTotal / new Date().getDate()).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};