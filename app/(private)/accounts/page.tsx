"use client"

import { useState } from "react"
import {
  Building2,
  CreditCard,
  Plus,
  Eye,
  EyeOff,
  Wallet,
  PiggyBank,
  MoreVertical,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useAccounts, useDeleteAccount, useEditAccountDrawer } from "@/lib/hooks"
import { ReusableDrawer } from "@/components/ReusableDrawer"
import { AddAccountFormContent } from "@/components/AddAccountFormContent"
import { useAddAccountDrawer } from "@/lib/hooks/use-add-account-drawer"
import { EditAccountDrawer } from "@/components/EditAccountDrawer"
import { DeleteConfirmationSheet } from "@/components/DeleteConfirmationSheet"

export default function AccountsPage() {
  const { user, isLoading } = useAuth()
  const [showBalances, setShowBalances] = useState(true)
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const {
    isOpen,
    openDrawer,
    closeDrawer,
    formData,
    setFormData,
    handleSubmit,
    isSubmitDisabled,
    isLoading: isSubmitting,
  } = useAddAccountDrawer()

  // Edit account drawer
  const {
    isOpen: isEditOpen,
    openDrawer: openEditDrawer,
    closeDrawer: closeEditDrawer,
    formData: editFormData,
    setFormData: setEditFormData,
    handleSubmit: handleEditSubmit,
    isSubmitDisabled: isEditSubmitDisabled,
    isLoading: isEditLoading,
  } = useEditAccountDrawer()

  // Get user's accounts
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts(user?.id || "", {
    enabled: !!user?.id,
  })

  const deleteAccount = useDeleteAccount()

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

  const totalBalance = accounts.reduce(
    (sum: number, account: any) => sum + (account.balance || 0),
    0
  )

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank":
        return Building2
      case "credit":
        return CreditCard
      case "cash":
        return Wallet
      case "savings":
        return PiggyBank
      default:
        return Building2
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "bank":
        return "bg-blue-500"
      case "credit":
        return "bg-purple-500"
      case "cash":
        return "bg-green-500"
      case "savings":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDeleteClick = (accountId: string) => {
    setDeleteAccountId(accountId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteAccountId) return

    try {
      await deleteAccount.mutateAsync(deleteAccountId)
      setShowDeleteConfirm(false)
      setDeleteAccountId(null)
    } catch (error) {
      console.error("Failed to delete account:", error)
    }
  }

  const accountToDelete = accounts.find((account: any) => account.id === deleteAccountId)

  return (
    <div className="max-w-md mx-auto h-full">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-black">My Accounts</h1>
          <button
            onClick={openDrawer}
            className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
          >
            <Plus className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Total Balance</span>
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showBalances ? `₹ ${totalBalance.toLocaleString()}` : "₹ ****"}
          </div>
          <div className="text-sm opacity-90 mt-1">{accounts.length} accounts</div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-black mb-4">All Accounts</h2>

        {accountsLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border border-gray-200/60 animate-pulse overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Row Skeleton */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-28"></div>
                  </div>

                  {/* Bottom Row Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-7 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-9 h-9 bg-gray-200 rounded-xl"></div>
                      <div className="w-9 h-9 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div className="space-y-6">
            {accounts.map((account: any) => {
              const Icon = getAccountIcon(account.type)
              const color = getAccountColor(account.type)

              return (
                <div
                  key={account.id}
                  className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border border-gray-200/60 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-pink-50/30 transition-all duration-700"></div>

                  {/* Decorative accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-80`}
                  ></div>

                  <div className="relative p-6">
                    {/* Top Row - Icon, Name, and Balance */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Left: Icon and Account Name */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg transform group-hover:scale-110 transition-all duration-300`}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <div
                            className={`absolute inset-0 w-14 h-14 rounded-2xl ${color} opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500`}
                          ></div>
                        </div>
                        <div>
                          <div className="font-bold text-xl text-gray-900 group-hover:text-gray-800 transition-colors">
                            {account.name}
                          </div>
                          {account.account_number && (
                            <div className="text-sm text-gray-600 font-mono bg-gray-100/80 px-3 py-1 rounded-lg inline-block mt-1">
                              {account.account_number}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Balance */}
                      <div className="text-right">
                        <div
                          className={`font-black text-3xl bg-gradient-to-r ${
                            account.balance >= 0
                              ? "from-green-600 to-emerald-600"
                              : "from-red-500 to-pink-500"
                          } bg-clip-text text-transparent transform group-hover:scale-105 transition-all duration-300`}
                        >
                          {showBalances ? `₹${account.balance.toLocaleString()}` : "₹****"}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row - Type Badge, Status, and Actions */}
                    <div className="flex items-center justify-between">
                      {/* Left: Account Type and Status */}
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full border border-gray-200/60">
                          <span className="text-sm font-semibold text-gray-700 capitalize">
                            {account.type.replace("_", " ")}
                          </span>
                        </div>
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-full ${
                            account.balance >= 0
                              ? "bg-green-100 border border-green-200"
                              : "bg-red-100 border border-red-200"
                          }`}
                        >
                          <span
                            className={`text-xs font-bold ${
                              account.balance >= 0 ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {account.balance >= 0 ? "💰 Available" : "⚠️ Due"}
                          </span>
                        </div>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2">
                        <EditAccountDrawer
                          account={account}
                          isOpen={isEditOpen}
                          onOpenChange={(open) => !open && closeEditDrawer()}
                          formData={editFormData}
                          onFormDataChange={setEditFormData}
                          onSubmit={handleEditSubmit}
                          isLoading={isEditLoading}
                          isSubmitDisabled={isEditSubmitDisabled}
                        >
                          <button
                            className="p-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200 transform hover:scale-105"
                            onClick={() => openEditDrawer(account)}
                            title="Edit account"
                          >
                            <MoreVertical className="w-4 h-4 text-blue-600" />
                          </button>
                        </EditAccountDrawer>
                        <button
                          onClick={() => handleDeleteClick(account.id)}
                          className="p-2.5 rounded-xl hover:bg-red-50 hover:border-red-200 border border-transparent transition-all duration-200 transform hover:scale-105"
                          title="Delete account"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${color.replace(
                      "bg-",
                      ""
                    )} to-transparent opacity-60`}
                  ></div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">No accounts yet</div>
            <div className="text-sm">Add your first account to get started</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6 pb-6">
        <h2 className="text-lg font-bold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openDrawer}
            className="p-4 rounded-xl border border-gray-200 text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="text-sm font-medium text-black">Add Card</div>
          </button>
          <button
            onClick={openDrawer}
            className="p-4 rounded-xl border border-gray-200 text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">🏦</div>
            <div className="text-sm font-medium text-black">Add Account</div>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Sheet */}
      <DeleteConfirmationSheet
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Account"
        description="Are you sure you want to delete"
        itemName={accountToDelete?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        isPending={deleteAccount.isPending}
        confirmText="Delete Account"
        additionalDetails={
          accountToDelete && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {accountToDelete.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance:</span>
                <span
                  className={`font-medium ${
                    accountToDelete.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹ {accountToDelete.balance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`font-medium ${
                    accountToDelete.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {accountToDelete.balance >= 0 ? "Available" : "Due"}
                </span>
              </div>
            </div>
          )
        }
      />

      {/* Add Account Drawer */}
      <ReusableDrawer
        isOpen={isOpen}
        onOpenChange={(open) => !open && closeDrawer()}
        title="Add Account"
        onCancel={closeDrawer}
        onSubmit={handleSubmit}
        submitTitle={isSubmitting ? "Adding..." : "Add"}
        submitIcon={<Plus className="w-4 h-4" />}
        submitDisabled={isSubmitDisabled}
      >
        <AddAccountFormContent
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </ReusableDrawer>
    </div>
  )
}
