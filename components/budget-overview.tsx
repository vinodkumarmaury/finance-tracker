"use client";

import { Card } from "@/components/ui/card";
import { Transaction, Budget, CATEGORIES } from "@/app/page";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export function BudgetOverview({
  transactions,
  budgets,
  onUpdateBudget,
}: { 
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (category: string, amount: number) => void;
}) {
  // Add state to track if mobile view is expanded
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getCategoryExpenses = (category: string) => {
    return transactions
      .filter((t) => t.category === category)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getProgress = (category: string) => {
    const budget = budgets.find((b) => b.category === category)?.amount || 0;
    const expenses = getCategoryExpenses(category);
    return budget > 0 ? Math.min((expenses / budget) * 100, 100) : 0;
  };

  return (
    <Card className="col-span-2 shadow-md hover:shadow-lg transition-shadow duration-300 w-full md:w-[89%] mr-auto">
      <div className="p-4 md:p-6">
        <div className="space-y-2 mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200">Budget Overview</h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Track your spending against budget
          </p>
        </div>
        
        {/* Desktop and tablet view - standard table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Budget</TableHead>
                <TableHead className="font-semibold">Spent</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CATEGORIES.map((category, index) => {
                const budget = budgets.find((b) => b.category === category)?.amount || 0;
                const spent = getCategoryExpenses(category);
                const progress = getProgress(category);
                const animationDelay = `${index * 0.1}s`;

                return (
                  <TableRow 
                    key={category} 
                    className="animate-fade-in hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    style={{ animationDelay }}
                  >
                    <TableCell className="font-medium">{category}</TableCell>
                    <TableCell>
                      <Input placeholder="0"
                        type="number"
                        value={budget || ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? 0 : Number(e.target.value);
                          onUpdateBudget(category, value);
                        }}
                        className="w-24 transition-all focus:ring-2 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700 dark:text-gray-300">${spent.toFixed(2)}</TableCell>
                    <TableCell className="w-[300px]">
                      <div className="space-y-2">
                        <Progress 
                          value={progress} 
                          className="h-2.5 transition-all duration-700 ease-in-out" 
                        />
                        <p className="text-sm text-muted-foreground">
                          {budget > 0 ? `${progress.toFixed(0)}% of budget` : 'No budget set'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Mobile view - card based layout */}
        <div className="md:hidden space-y-4">
          {CATEGORIES.map((category, index) => {
            const budget = budgets.find((b) => b.category === category)?.amount || 0;
            const spent = getCategoryExpenses(category);
            const progress = getProgress(category);
            const isExpanded = expandedCategory === category;
            const animationDelay = `${index * 0.1}s`;
            
            return (
              <div 
                key={category}
                className="border rounded-lg p-3 animate-fade-in hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ animationDelay }}
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{category}</h4>
                  <span className="text-sm font-semibold">
                    ${spent.toFixed(2)} {budget > 0 && `/ $${budget}`}
                  </span>
                </div>
                
                <div className="mt-2">
                  <Progress 
                    value={progress} 
                    className="h-2 transition-all duration-700 ease-in-out" 
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{budget > 0 ? `${progress.toFixed(0)}%` : 'No budget'}</span>
                    <span>{isExpanded ? 'Tap to collapse' : 'Tap to edit'}</span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <label className="text-sm">Budget amount:</label>
                    <Input
                      type="number"
                      value={budget || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : Number(e.target.value);
                        onUpdateBudget(category, value);
                      }}
                      className="w-24 h-8 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}