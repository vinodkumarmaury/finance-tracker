"use client";

import { Card } from "@/components/ui/card";
import { Transaction } from "@/app/page";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function Overview({ transactions }: { transactions: Transaction[] }) {
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
    });
    const existingMonth = acc.find((item) => item.name === month);
    
    if (existingMonth) {
      existingMonth.total += transaction.amount;
    } else {
      acc.push({ name: month, total: transaction.amount });
    }
    
    return acc;
  }, []);

  return (
    <Card className="col-span-4">
      <div className="p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Monthly Overview</h3>
          <p className="text-sm text-muted-foreground">
            Monthly expense breakdown
          </p>
        </div>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                scale="band"
                padding={{ left: 20, right: 20 }}
                interval="preserveStartEnd"
                minTickGap={0}
                tickMargin={8}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                width={80}
                interval="preserveEnd"
                minTickGap={8}
                tickMargin={8}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                contentStyle={{ 
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  padding: "8px"
                }}
                formatter={(value) => [`$${value}`, "Total"]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
                isAnimationActive={true}
                animationDuration={1500}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}