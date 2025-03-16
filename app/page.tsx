"use client";

import { Card } from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { AddTransaction } from "@/components/add-transaction";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { BudgetOverview } from "@/components/budget-overview";
import { BudgetComparison } from "@/components/budget-comparison";
import { SpendingInsights } from "@/components/spending-insights";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export type Budget = {
  category: string;
  amount: number;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>(
    CATEGORIES.map((category) => ({ category, amount: 0 }))
  );

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    // Find the budget for the transaction's category
    const categoryBudget = budgets.find(b => b.category === transaction.category)?.amount || 0;
    
    // Calculate current spending for this category
    const currentCategorySpending = transactions
      .filter(t => t.category === transaction.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Check if adding this transaction would exceed the budget
    if (categoryBudget > 0 && (currentCategorySpending + transaction.amount > categoryBudget)) {
      alert(`Insufficient budget for ${transaction.category}! Please add funds to your budget first.`);
      return; // Don't add the transaction
    }
    
    // If we have sufficient budget or budget is 0 (unconfigured), add the transaction
    setTransactions([
      ...transactions,
      { ...transaction, id: Math.random().toString() },
    ]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
  };

  const updateBudget = (category: string, amount: number) => {
    setBudgets(
      budgets.map((b) =>
        b.category === category ? { ...b, amount } : b
      )
    );
  };

  const getTotalExpenses = () => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter((t) => new Date(t.date).getMonth() === currentMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getAverageTransaction = () => {
    return transactions.length
      ? (transactions.reduce((acc, curr) => acc + curr.amount, 0) /
          transactions.length)
      : 0;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900 md:w-[85%]">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Finance Tracker</h1>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 animate-fade-in">
        {/* Replace grid with better responsive layout */}
        <div className="container p-4 md:p-8">
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">Dashboard</h3>
            
            {/* Summary cards - 1 per row on mobile, 3 on desktop */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-5 card-transition animate-slide-up shadow-md">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total Expenses
                  </p>
                  <p className="text-3xl font-extrabold">
                    ${getTotalExpenses().toFixed(2)}
                  </p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    This Month
                  </p>
                  <p className="text-2xl font-bold">
                    ${getCurrentMonthExpenses().toFixed(2)}
                  </p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Transaction
                  </p>
                  <p className="text-2xl font-bold">
                    ${getAverageTransaction().toFixed(2)}
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Mobile transaction controls - visible only on small screens */}
            <div className="md:hidden space-y-6">
              <AddTransaction onAdd={addTransaction} categories={CATEGORIES} />
              <RecentTransactions
                transactions={transactions.slice(0, 3)} // Show fewer transactions on mobile
                onDelete={deleteTransaction}
                onEdit={editTransaction}
                categories={CATEGORIES}
              />
            </div>
            
            {/* Charts section - 1 per row on mobile, 2 on tablet/desktop */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Overview transactions={transactions} />
              <CategoryBreakdown transactions={transactions} />
            </div>
            
            {/* Full-width components */}
            <BudgetComparison transactions={transactions} budgets={budgets} />
            <SpendingInsights transactions={transactions} budgets={budgets} />
            <BudgetOverview transactions={transactions} budgets={budgets} onUpdateBudget={updateBudget} />
          </div>
        </div>
        
        {/* Fixed sidebar for desktop with AddTransaction always visible */}
        <div className="hidden md:block fixed right-0 top-16 bottom-0 w-[350px] border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
          {/* Fixed AddTransaction - always visible at top */}
          <div className="p-6 border-b">
            <AddTransaction onAdd={addTransaction} categories={CATEGORIES} />
          </div>
          
          {/* Scrollable RecentTransactions */}
          <div className="flex-1 overflow-y-auto p-6">
            <RecentTransactions
              transactions={transactions}
              onDelete={deleteTransaction}
              onEdit={editTransaction}
              categories={CATEGORIES}
            />
          </div>
        </div>
      </main>
    </div>
  );
}