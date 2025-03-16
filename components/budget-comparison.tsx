"use client";

import { Card } from "@/components/ui/card";
import { Transaction, Budget } from "@/app/page";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export function BudgetComparison({ 
  transactions, 
  budgets 
}: { 
  transactions: Transaction[]; 
  budgets: Budget[] 
}) {
  // Format data for the comparison chart
  const comparisonData = budgets.map(budget => {
    // Calculate total spending in this category
    const spent = transactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: budget.category,
      Budget: budget.amount,
      Spent: spent,
      // Add fill properties based on whether spending exceeds budget
      SpentFill: spent > budget.amount ? "#ef4444" : "#3b82f6"
    };
  }).filter(item => item.Budget > 0); // Only show categories with budgets

  return (
    <Card className="col-span-2 shadow-md hover-scale card-transition animate-fade-in w-full md:w-[75%] mr-auto">
      <div className="p-6">
        <div className="space-y-2 mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Budget vs. Actual</h3>
          <p className="text-sm text-muted-foreground">
            Compare your spending against budgets
          </p>
        </div>
        <div className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, ""]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                animationDuration={300}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar 
                dataKey="Budget" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
              <Bar 
                dataKey="Spent" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}