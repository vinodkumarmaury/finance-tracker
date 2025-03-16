"use client";

import { Card } from "@/components/ui/card";
import { Transaction, Budget } from "@/app/page";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export function SpendingInsights({ 
  transactions, 
  budgets 
}: { 
  transactions: Transaction[]; 
  budgets: Budget[] 
}) {
  // Get current month and previous month
  const now = new Date();
  const currentMonth = now.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const currentYear = now.getFullYear();
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Define the Insight type
  interface Insight {
    type: 'warning' | 'danger' | 'success' | 'info';
    category: string;
    message: string;
    icon: React.ReactNode;
  }

  // Function to get insights
  const getInsights = (): Insight[] => {
    const insights: Insight[] = [];
    
    // Check which categories are close to budget
    budgets.forEach(budget => {
      if (budget.amount <= 0) return;
      
      const spent = transactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const remainingBudget = budget.amount - spent;
      const percentUsed = (spent / budget.amount) * 100;
      
      if (percentUsed >= 90 && percentUsed < 100) {
        insights.push({
          type: "warning",
          category: budget.category,
          message: `You've used ${percentUsed.toFixed(0)}% of your ${budget.category} budget. Only $${remainingBudget.toFixed(2)} remaining.`,
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
        });
      } else if (percentUsed >= 100) {
        insights.push({
          type: "danger",
          category: budget.category,
          message: `You've exceeded your ${budget.category} budget by $${Math.abs(remainingBudget).toFixed(2)}.`,
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        });
      } else if (percentUsed <= 50 && spent > 0) {
        insights.push({
          type: "success",
          category: budget.category,
          message: `Great job! You've only used ${percentUsed.toFixed(0)}% of your ${budget.category} budget.`,
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
        });
      }
    });
    
    // Compare spending with previous month
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const previousMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });
    
    // Group by category
    const categories = Array.from(new Set(transactions.map(t => t.category)));
    
    categories.forEach(category => {
      const currentMonthSpending = currentMonthTransactions
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const previousMonthSpending = previousMonthTransactions
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (previousMonthSpending > 0) {
        const percentChange = ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100;
        
        if (percentChange > 20) {
          insights.push({
            type: "info",
            category,
            message: `Your ${category} spending increased by ${percentChange.toFixed(0)}% compared to last month.`,
            icon: <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
          });
        } else if (percentChange < -20) {
          insights.push({
            type: "info",
            category,
            message: `Your ${category} spending decreased by ${Math.abs(percentChange).toFixed(0)}% compared to last month.`,
            icon: <ArrowTrendingDownIcon className="h-5 w-5 text-blue-500" />
          });
        }
      }
    });
    
    return insights;
  };
  
  const insights = getInsights();

  return (
    <Card className="col-span-2 shadow-md animate-fade-in card-transition">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Spending Insights</h3>
        
        {insights.length === 0 ? (
          <p className="text-muted-foreground">Not enough data to generate insights yet. Add more transactions!</p>
        ) : (
          <ul className="space-y-4">
            {insights.map((insight, index) => (
              <li 
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg animate-fade-in`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: insight.type === 'danger' ? 'rgba(254, 226, 226, 0.5)' : 
                                 insight.type === 'warning' ? 'rgba(254, 243, 199, 0.5)' :
                                 insight.type === 'success' ? 'rgba(209, 250, 229, 0.5)' : 
                                 'rgba(219, 234, 254, 0.5)',
                }}
              >
                <div className="flex-shrink-0 pt-1">
                  {insight.icon}
                </div>
                <div>
                  <p className="font-medium">{insight.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{insight.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}