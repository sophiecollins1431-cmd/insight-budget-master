import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface AddExpenseFormProps {
  onAddExpense: (expense: {
    category: string;
    amount: number;
    description?: string;
    date: string;
  }) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
}

export const AddExpenseForm = ({ onAddExpense, categories, onAddCategory }: AddExpenseFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) return;

    onAddExpense({
      category,
      amount: parseFloat(amount),
      description: description || undefined,
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setIsOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full mb-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg animate-bounce-in"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Expense
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-6 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add New Expense</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            {isAddingCategory ? (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  size="sm"
                  variant="outline"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="__add_new__" onSelect={() => setIsAddingCategory(true)}>
                    <span className="text-primary">+ Add New Category</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes about this expense..."
            rows={2}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            Add Expense
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};