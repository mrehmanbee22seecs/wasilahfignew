import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Calendar,
  FileText, AlertTriangle, CheckCircle, Download, Upload
} from 'lucide-react';
import type { ProjectBudgetSummary, BudgetCategory, Expense } from '../../types/ngo-payments';
import { toast } from 'sonner';

interface BudgetVsActualTabProps {
  budgetSummary: ProjectBudgetSummary;
  expenses: Expense[];
  onAddExpense: (expense: Partial<Expense>) => Promise<void>;
  onUploadReceipt: (file: File) => Promise<string>;
}

export function BudgetVsActualTab({
  budgetSummary,
  expenses,
  onAddExpense,
  onUploadReceipt
}: BudgetVsActualTabProps) {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-600';
    if (percent >= 90) return 'bg-amber-500';
    if (percent >= 75) return 'bg-blue-600';
    return 'bg-emerald-600';
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'; // Over budget
    if (variance < 0) return 'text-green-600'; // Under budget
    return 'text-gray-600';
  };

  const isOverBudget = budgetSummary.remaining < 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-1">Budget vs Actual</h2>
        <p className="text-sm text-gray-600">
          Track project spending against allocated budget
        </p>
      </div>

      {/* Over Budget Alert */}
      {isOverBudget && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-red-900 font-medium">Project Over Budget</p>
              <p className="text-sm text-red-800 mt-1">
                Current spending exceeds allocated budget by {formatCurrency(Math.abs(budgetSummary.remaining))}. 
                Please review expenses and contact your corporate partner.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Budget</span>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl text-gray-900 mb-1">
            {formatCurrency(budgetSummary.totalBudget)}
          </div>
          <div className="text-xs text-gray-600">Project allocation</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Funds Received</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl text-gray-900 mb-1">
            {formatCurrency(budgetSummary.totalReceived)}
          </div>
          <div className="text-xs text-gray-600">
            {((budgetSummary.totalReceived / budgetSummary.totalBudget) * 100).toFixed(1)}% of budget
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl text-gray-900 mb-1">
            {formatCurrency(budgetSummary.totalSpent)}
          </div>
          <div className="text-xs text-gray-600">
            {budgetSummary.utilizationPercent.toFixed(1)}% utilized
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Remaining</span>
            <TrendingDown className={`w-5 h-5 ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-2xl mb-1 ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(budgetSummary.remaining)}
          </div>
          <div className="text-xs text-gray-600">
            {((budgetSummary.remaining / budgetSummary.totalBudget) * 100).toFixed(1)}% available
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700">Overall Budget Utilization</span>
          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            {budgetSummary.utilizationPercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${getProgressColor(budgetSummary.utilizationPercent)}`}
            style={{ width: `${Math.min(budgetSummary.utilizationPercent, 100)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-600 rounded" />
            <span>Spent: {formatCurrency(budgetSummary.totalSpent)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded" />
            <span>Committed: {formatCurrency(budgetSummary.totalCommitted)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <span>Available: {formatCurrency(budgetSummary.remaining)}</span>
          </div>
        </div>
      </div>

      {/* Budget Categories Table */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Budget Categories</h3>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-3 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Budgeted</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Spent</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Committed</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Remaining</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Variance</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {budgetSummary.categories.map((category) => {
              const utilizationPercent = ((category.spent + category.committed) / category.budgeted) * 100;
              const categoryOverBudget = category.remaining < 0;
              
              return (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {category.category}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(category.budgeted)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(category.spent)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-amber-700">
                    {formatCurrency(category.committed)}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm ${categoryOverBudget ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatCurrency(category.remaining)}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm ${getVarianceColor(category.variance)}`}>
                    {category.variancePercent > 0 ? '+' : ''}{category.variancePercent.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${getProgressColor(utilizationPercent)}`}
                          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {utilizationPercent.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Recent Expenses</h3>
        </div>

        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No expenses recorded</h3>
            <p className="text-gray-600 text-sm mb-4">
              Start tracking your project expenses
            </p>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{expense.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.expenseDate)}
                      </span>
                      <span>•</span>
                      <span>{expense.category}</span>
                      {expense.vendor && (
                        <>
                          <span>•</span>
                          <span>{expense.vendor}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                    {expense.receiptUrl && (
                      <a
                        href={expense.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1"
                      >
                        <FileText className="w-3 h-3" />
                        Receipt
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowAddExpenseModal(false)}
          onAdd={onAddExpense}
          onUploadReceipt={onUploadReceipt}
          categories={budgetSummary.categories}
        />
      )}
    </div>
  );
}

// Add Expense Modal
function AddExpenseModal({
  onClose,
  onAdd,
  onUploadReceipt,
  categories
}: {
  onClose: () => void;
  onAdd: (expense: Partial<Expense>) => Promise<void>;
  onUploadReceipt: (file: File) => Promise<string>;
  categories: BudgetCategory[];
}) {
  const [formData, setFormData] = useState({
    budgetCategoryId: '',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
    vendor: '',
    paymentMethod: 'bank_transfer' as const
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Receipt must be under 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.budgetCategoryId || !formData.amount || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setUploading(true);

    try {
      let receiptUrl = undefined;
      
      if (receiptFile) {
        receiptUrl = await onUploadReceipt(receiptFile);
      }

      const selectedCategory = categories.find(c => c.id === formData.budgetCategoryId);

      await onAdd({
        ...formData,
        amount: parseFloat(formData.amount),
        category: selectedCategory?.category || '',
        receiptUrl
      });

      toast.success('Expense added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl text-gray-900 mb-6">Add Expense</h3>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.budgetCategoryId}
              onChange={(e) => setFormData({ ...formData, budgetCategoryId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.category} (PKR {cat.remaining.toLocaleString()} remaining)
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Amount <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">PKR</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="5000"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              placeholder="What was this expense for?"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Expense Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Vendor/Supplier (Optional)
            </label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="ABC Suppliers"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
            </select>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Receipt (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {receiptFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-900">{receiptFile.name}</span>
                  </div>
                  <button
                    onClick={() => setReceiptFile(null)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Upload receipt (PDF, JPG, PNG - max 5MB)</p>
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {uploading ? 'Adding...' : 'Add Expense'}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
