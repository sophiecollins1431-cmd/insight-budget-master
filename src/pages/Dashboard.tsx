import { useState, useEffect } from "react";
import { BalanceCard } from "@/components/BalanceCard";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseCard } from "@/components/ExpenseCard";
import { FilterDialog, FilterOptions } from "@/components/FilterDialog";
import { InsightsCard } from "@/components/InsightsCard";
import { AuthPrompt } from "@/components/AuthPrompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Settings, Filter, Search, X, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

interface MonthlyBudget {
  month: string; // YYYY-MM format
  income: number;
}

const DEFAULT_CATEGORIES = [
  "Rent", "Food", "Transportation", "Utilities", "Entertainment", 
  "Healthcare", "Shopping", "Bills", "Insurance", "Other"
];

export default function Dashboard() {
  const [monthlyIncome, setMonthlyIncome] = useState(4000);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showIncomeSetup, setShowIncomeSetup] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [budgetMonths, setBudgetMonths] = useState(1);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ searchTerm: "" });
  const [showInsights, setShowInsights] = useState(false);

  // Get current month expenses and budget
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBudget = monthlyBudgets.find(b => b.month === currentMonth)?.income || monthlyIncome;
  const currentMonthExpenses = expenses.filter(e => e.date.slice(0, 7) === currentMonth);
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = currentMonthBudget - totalExpenses;

  const filteredExpenses = expenses.filter(expense => {
    // Search term filter
    const matchesSearch = !filters.searchTerm || 
      expense.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Date range filter
    let matchesDate = true;
    if (filters.dateFrom || filters.dateTo) {
      const expenseDate = new Date(expense.date);
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && expenseDate >= fromDate;
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && expenseDate <= toDate;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    toast.success(`Added $${expenseData.amount.toFixed(2)} expense for ${expenseData.category}`);
  };

  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (expense) {
      toast.success(`Deleted $${expense.amount.toFixed(2)} expense`);
    }
  };

  const handleEditExpense = (id: string) => {
    toast.info("Edit functionality will be available in the next update!");
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      toast.success(`Added new category: ${category}`);
    }
  };

  const handleUpdateIncome = () => {
    const newIncome = parseFloat(tempIncome);
    if (newIncome > 0) {
      setMonthlyIncome(newIncome);
      
      // Create budgets for the specified number of months
      const budgets: MonthlyBudget[] = [];
      const startDate = new Date();
      
      for (let i = 0; i < budgetMonths; i++) {
        const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const monthKey = monthDate.toISOString().slice(0, 7);
        budgets.push({ month: monthKey, income: newIncome });
      }
      
      setMonthlyBudgets(prev => {
        const existing = prev.filter(b => !budgets.some(nb => nb.month === b.month));
        return [...existing, ...budgets];
      });
      
      setShowIncomeSetup(false);
      toast.success(`Updated income to $${newIncome.toFixed(2)} for ${budgetMonths} month${budgetMonths > 1 ? 's' : ''}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Smart Expense Tracker</h1>
            <p className="text-muted-foreground">Track your expenses and manage your budget</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInsights(!showInsights)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Insights
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIncomeSetup(!showIncomeSetup)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </Button>
          </div>
        </div>

        {/* Authentication Prompt */}
        <AuthPrompt />

        {/* Income Setup */}
        {showIncomeSetup && (
          <Card className="p-4 mb-6 animate-slide-up">
            <h3 className="font-semibold mb-3">Monthly Income & Budget Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="income">Monthly Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  step="0.01"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  placeholder="Enter your monthly income"
                />
              </div>
              <div>
                <Label htmlFor="months">Number of Months</Label>
                <Input
                  id="months"
                  type="number"
                  min="1"
                  max="24"
                  value={budgetMonths}
                  onChange={(e) => setBudgetMonths(parseInt(e.target.value) || 1)}
                  placeholder="1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set budget for {budgetMonths} month{budgetMonths > 1 ? 's' : ''} ahead
                </p>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleUpdateIncome} className="flex-1">Update</Button>
                <Button variant="outline" onClick={() => setShowIncomeSetup(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Balance Overview */}
        <BalanceCard
          monthlyIncome={currentMonthBudget}
          totalExpenses={totalExpenses}
          remainingBalance={remainingBalance}
        />

        {/* Insights */}
        {showInsights && <InsightsCard expenses={expenses} />}

        {/* Add Expense Form */}
        <AddExpenseForm
          onAddExpense={handleAddExpense}
          categories={categories}
          onAddCategory={handleAddCategory}
        />

        {/* Search and Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search expenses..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilterDialog(true)}
              className={filters.dateFrom || filters.dateTo || filters.quickFilter ? "border-primary bg-primary/10" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {(filters.dateFrom || filters.dateTo || filters.quickFilter) && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-2 h-2 text-xs flex items-center justify-center"></span>
              )}
            </Button>
            {(filters.searchTerm || filters.dateFrom || filters.dateTo || filters.quickFilter) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilters({ searchTerm: "" })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(filters.dateFrom || filters.dateTo || filters.quickFilter) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {filters.quickFilter && (
                <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {filters.quickFilter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              )}
              {filters.dateFrom && !filters.quickFilter && (
                <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  From: {new Date(filters.dateFrom).toLocaleDateString()}
                </div>
              )}
              {filters.dateTo && !filters.quickFilter && (
                <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  To: {new Date(filters.dateTo).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Expenses List */}
        <div className="space-y-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Recent Expenses
            <span className="text-sm text-muted-foreground font-normal">
              ({filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'})
            </span>
          </h2>
          
          {filteredExpenses.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {(filters.searchTerm || filters.dateFrom || filters.dateTo || filters.quickFilter) 
                  ? 'No expenses match your filters.' 
                  : 'No expenses yet. Add your first expense above!'}
              </p>
            </Card>
          ) : (
            filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                {...expense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            ))
          )}
        </div>

        {/* Filter Dialog */}
        <FilterDialog
          isOpen={showFilterDialog}
          onClose={() => setShowFilterDialog(false)}
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />
      </div>
    </div>
  );
}