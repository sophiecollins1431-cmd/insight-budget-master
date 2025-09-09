import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Filter, X, Calendar as CalendarLucide, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export interface FilterOptions {
  searchTerm: string;
  dateFrom?: Date;
  dateTo?: Date;
  quickFilter?: string;
  customMonths?: number;
  customYears?: number;
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
}

export const FilterDialog = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  categories 
}: FilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = { searchTerm: "" };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleQuickFilter = (value: string) => {
    const now = new Date();
    let dateFrom: Date | undefined;
    
    switch (value) {
      case "last-week":
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last-month":
        dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "last-3-months":
        dateFrom = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "last-6-months":
        dateFrom = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case "last-year":
        dateFrom = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case "custom":
        dateFrom = undefined;
        break;
      default:
        dateFrom = undefined;
    }

    setLocalFilters(prev => ({
      ...prev,
      quickFilter: value,
      dateFrom: value !== "custom" ? dateFrom : prev.dateFrom,
      dateTo: value !== "custom" ? now : prev.dateTo,
      customMonths: value === "custom" ? prev.customMonths : undefined,
      customYears: value === "custom" ? prev.customYears : undefined,
    }));
  };

  const handleCustomTimeRange = () => {
    const now = new Date();
    let dateFrom = new Date(now);

    if (localFilters.customMonths) {
      dateFrom = new Date(now.getFullYear(), now.getMonth() - localFilters.customMonths, now.getDate());
    }
    
    if (localFilters.customYears) {
      dateFrom = new Date(now.getFullYear() - localFilters.customYears, now.getMonth(), now.getDate());
    }

    setLocalFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo: now,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Expenses
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search by category or description</Label>
              <Input
                id="search"
                value={localFilters.searchTerm}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                placeholder="Search expenses..."
              />
            </div>

            <Separator />

            {/* Quick Date Filters */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" />
                Quick Time Filters
              </Label>
              <Select 
                value={localFilters.quickFilter || ""} 
                onValueChange={handleQuickFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Time Range */}
            {localFilters.quickFilter === "custom" && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-medium">Custom Time Range</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="months" className="text-xs">Last X Months</Label>
                    <Input
                      id="months"
                      type="number"
                      min="1"
                      max="60"
                      value={localFilters.customMonths || ""}
                      onChange={(e) => setLocalFilters(prev => ({ 
                        ...prev, 
                        customMonths: e.target.value ? parseInt(e.target.value) : undefined,
                        customYears: undefined 
                      }))}
                      placeholder="e.g., 3"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="years" className="text-xs">Last X Years</Label>
                    <Input
                      id="years"
                      type="number"
                      min="1"
                      max="10"
                      value={localFilters.customYears || ""}
                      onChange={(e) => setLocalFilters(prev => ({ 
                        ...prev, 
                        customYears: e.target.value ? parseInt(e.target.value) : undefined,
                        customMonths: undefined 
                      }))}
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCustomTimeRange}
                  className="w-full"
                  disabled={!localFilters.customMonths && !localFilters.customYears}
                >
                  Apply Custom Range
                </Button>
              </div>
            )}

            <Separator />

            {/* Manual Date Range */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <CalendarLucide className="h-4 w-4" />
                Custom Date Range
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2 block">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.dateFrom ? format(localFilters.dateFrom, "MMM dd, yyyy") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.dateFrom}
                        onSelect={(date) => setLocalFilters(prev => ({ ...prev, dateFrom: date, quickFilter: undefined }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.dateTo ? format(localFilters.dateTo, "MMM dd, yyyy") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.dateTo}
                        onSelect={(date) => setLocalFilters(prev => ({ ...prev, dateTo: date, quickFilter: undefined }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};