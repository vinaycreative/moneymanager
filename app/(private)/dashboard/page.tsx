"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"
import { AddTransactionModal } from "@/components/AddTransactionModal"
import { DashboardStats } from "@/components/DashboardStats"
import { useAuth } from "@/lib/contexts/auth-context"
import { useTransactions, useTransactionSummary } from "@/lib/hooks"

export default function Dashboard() {
  const { user, profile, isLoading } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentDate] = useState("Today")

  // Get user's transactions
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(user?.id || "", {
    enabled: !!user?.id,
  })

  // Get transaction summary for selected date
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary(user?.id || "", {
    enabled: !!user?.id,
  })

  // Check if selected date is today
  const isToday = () => {
    const today = new Date()
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }

  // Check if selected date is in the future
  const isFuture = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    return selected > today
  }

  // Navigate to previous date
  const goToPreviousDate = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  // Navigate to next date
  const goToNextDate = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  // Format date for display
  const formatDateDisplay = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }

  // Filter transactions for selected date
  const getTransactionsForDate = () => {
    if (!transactions) return []

    const selectedDateStr = selectedDate.toISOString().split("T")[0]
    return transactions.filter((transaction: any) => {
      const transactionDate = new Date(transaction.transaction_date).toISOString().split("T")[0]
      return transactionDate === selectedDateStr
    })
  }

  const transactionsForDate = getTransactionsForDate()
  const transactionCount = transactionsForDate.length

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
      </div>
    )
  }

  // Calculate totals for selected date
  const totalExpenses = transactionsForDate
    .filter((t: any) => t.type === "expense")
    .reduce((sum: number, t: any) => sum + t.amount, 0)

  const totalIncome = transactionsForDate
    .filter((t: any) => t.type === "income")
    .reduce((sum: number, t: any) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses

  return (
    <div className="max-w-md mx-auto h-full">
      {/* Date Navigation */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousDate}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="text-center">
            <div className="text-black font-medium">{formatDateDisplay(selectedDate)}</div>
            <div className="text-sm text-gray-500">
              {transactionCount} transaction{transactionCount !== 1 ? "s" : ""}
            </div>
          </div>

          <button
            onClick={goToNextDate}
            disabled={isToday()}
            className={`p-2 rounded-lg transition-colors ${
              isToday()
                ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="px-4 mb-6">
        <DashboardStats
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          netSavings={netSavings}
          transactionCount={transactionCount}
          isLoading={summaryLoading}
        />
      </div>

      {/* Add Transaction Button */}
      <div className="px-4 mb-6">
        <AddTransactionModal>
          <button className="w-full bg-black text-white rounded-xl py-4 flex items-center justify-center gap-2 font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </AddTransactionModal>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black">Recent Transactions</h2>
          <button className="text-sm text-gray-500 hover:text-gray-700">View All</button>
        </div>

        {transactionsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : transactionsForDate.length > 0 ? (
          <div className="space-y-4">
            {transactionsForDate.slice(0, 5).map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.categories?.color || "bg-gray-400"
                  } text-white font-bold`}
                >
                  {transaction.categories?.icon || "💰"}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-black">{transaction.title}</div>
                  <div className="text-sm text-gray-500">
                    {transaction.categories?.name || "Uncategorized"}
                  </div>
                </div>

                <div
                  className={`font-medium ${
                    transaction.type === "expense" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {transaction.type === "expense" ? "-" : "+"} ₹{" "}
                  {transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">No transactions for this date</div>
            <div className="text-sm">Add a transaction to get started</div>
          </div>
        )}
      </div>
    </div>
  )
}
