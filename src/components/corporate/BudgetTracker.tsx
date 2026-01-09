import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, 
  Calendar, BarChart3, AlertCircle, CheckCircle, X 
} from 'lucide-react';
import type { BudgetLine, BudgetAlert, BudgetForecast } from '../../types/corporate';

interface BudgetTrackerProps {
  budgetLines: BudgetLine[];
  projectBudgets: BudgetLine[];
  alerts: BudgetAlert[];
  forecast?: BudgetForecast[];
  totalBudget?: number;
  onAcknowledgeAlert: (alertId: string) => void;
}

export function BudgetTracker({ 
  budgetLines, 
  projectBudgets,
  alerts,
  forecast,
  totalBudget = 1800000,
  onAcknowledgeAlert
}: BudgetTrackerProps) {
  const [activeView, setActiveView] = useState<'category' | 'project'>('category');

  const totalSpent = budgetLines.reduce((sum, line) => sum + line.spent, 0);
  const totalCommitted = budgetLines.reduce((sum, line) => sum + line.committed, 0);
  const totalRemaining = totalBudget - totalSpent - totalCommitted;
  const percentUsed = ((totalSpent + totalCommitted) / totalBudget) * 100;

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600';
    if (variance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-600';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-emerald-600';
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl text-gray-900 mb-1">Budget Tracker</h2>
        <p className="text-sm text-gray-600">
          Monitor spending across categories and projects
        </p>
      </div>

      {/* Alerts Banner */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {unacknowledgedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg p-4 flex items-start justify-between ${
                alert.type === 'danger'
                  ? 'bg-red-50 border border-red-200'
                  : alert.type === 'warning'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 mt-0.5 ${
                    alert.type === 'danger'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      alert.type === 'danger'
                        ? 'text-red-900'
                        : alert.type === 'warning'
                        ? 'text-amber-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onAcknowledgeAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
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
            {formatCurrency(totalBudget)}
          </div>
          <div className="text-xs text-gray-600">Annual CSR Budget 2025</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl text-gray-900 mb-1">
            {formatCurrency(totalSpent)}
          </div>
          <div className="text-xs text-gray-600">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Committed</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl text-gray-900 mb-1">
            {formatCurrency(totalCommitted)}
          </div>
          <div className="text-xs text-gray-600">Approved but unpaid</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Remaining</span>
            <TrendingDown className={`w-5 h-5 ${totalRemaining > 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          </div>
          <div className={`text-2xl mb-1 ${totalRemaining > 0 ? 'text-gray-900' : 'text-red-600'}`}>
            {formatCurrency(totalRemaining)}
          </div>
          <div className="text-xs text-gray-600">
            {((totalRemaining / totalBudget) * 100).toFixed(1)}% available
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700">Overall Budget Utilization</span>
          <span className="text-sm font-medium text-gray-900">{percentUsed.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${getProgressColor(percentUsed)}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-600 rounded" />
            <span>Spent: {formatCurrency(totalSpent)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded" />
            <span>Committed: {formatCurrency(totalCommitted)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <span>Available: {formatCurrency(totalRemaining)}</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView('category')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeView === 'category'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          By Category
        </button>
        <button
          onClick={() => setActiveView('project')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeView === 'project'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          By Project
        </button>
      </div>

      {/* Budget Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                {activeView === 'category' ? 'Category' : 'Project'}
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Budgeted</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Spent</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Committed</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Remaining</th>
              <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Variance</th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(activeView === 'category' ? budgetLines : projectBudgets).map((line) => {
              const utilizationPercent = ((line.spent + line.committed) / line.budgeted) * 100;
              const isOverBudget = line.remaining < 0;
              
              return (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {activeView === 'category' ? line.category : line.projectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(line.budgeted)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(line.spent)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-amber-700">
                    {formatCurrency(line.committed)}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm ${isOverBudget ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatCurrency(line.remaining)}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm ${getVarianceColor(line.variance)}`}>
                    {line.variancePercent > 0 ? '+' : ''}{line.variancePercent.toFixed(1)}%
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

      {/* Budget Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">6-Month Forecast</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-600 uppercase">Month</th>
                  <th className="px-4 py-2 text-right text-xs text-gray-600 uppercase">Projected</th>
                  <th className="px-4 py-2 text-right text-xs text-gray-600 uppercase">Actual</th>
                  <th className="px-4 py-2 text-right text-xs text-gray-600 uppercase">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {forecast.map((month) => (
                  <tr key={month.month}>
                    <td className="px-4 py-3 text-sm text-gray-900">{month.month}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {formatCurrency(month.projected)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      {month.actual > 0 ? formatCurrency(month.actual) : '-'}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm ${getVarianceColor(month.variance)}`}>
                      {month.variance !== 0 ? formatCurrency(Math.abs(month.variance)) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Burn Rate Warning */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-medium">Budget Projection</p>
                <p className="text-sm text-amber-800 mt-1">
                  At current burn rate, you are projected to exceed annual budget by 10% (PKR 150,000) by end of year.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}