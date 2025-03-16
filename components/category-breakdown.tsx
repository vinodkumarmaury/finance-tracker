"use client";

import { Card } from "@/components/ui/card";
import { Transaction } from "@/app/page";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
  const categoryData = transactions.reduce((acc: { name: string; value: number }[], transaction) => {
    const existingCategory = acc.find((item) => item.name === transaction.category);
    
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({ name: transaction.category, value: transaction.amount });
    }
    
    return acc;
  }, []);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card className="col-span-1 shadow-md hover-scale card-transition animate-fade-in ">
      <div className="p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Category Breakdown</h3>
          <p className="text-sm text-muted-foreground">
            Expenses by category
          </p>
        </div>
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true} /* Enable animation */
                animationDuration={1000} 
                animationEasing="ease-out"
                minAngle={3}
                paddingAngle={2}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                isAnimationActive={true}
                animationDuration={500}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  padding: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconSize={12}
                iconType="circle"
                formatter={(value) => value.toString()}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}