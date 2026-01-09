import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BudgetAllocation {
  category: string;
  amount: number;
}

interface BudgetPieChartProps {
  budgetAllocation: BudgetAllocation[];
}

const COLORS = [
  '#0d9488', // teal-600
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#6366f1', // indigo-500
  '#f97316', // orange-500
];

export function BudgetPieChart({ budgetAllocation }: BudgetPieChartProps) {
  const totalBudget = budgetAllocation.reduce((sum, item) => sum + item.amount, 0);

  // Filter out zero amounts and prepare data
  const chartData = budgetAllocation
    .filter(item => item.amount > 0 && item.category.trim() !== '')
    .map(item => ({
      name: item.category,
      value: item.amount,
      percentage: ((item.amount / totalBudget) * 100).toFixed(1)
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <PieChart className="w-8 h-8 text-slate-400" />
          </div>
          <p>Add budget allocations to see chart</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-teal-300">PKR {payload[0].value.toLocaleString()}</p>
          <p className="text-sm text-slate-300">{payload[0].payload.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-3 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-slate-900 text-sm truncate">{entry.value}</div>
              <div className="text-slate-600 text-xs">
                PKR {entry.payload.value.toLocaleString()} ({entry.payload.percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Total */}
      <div className="mt-6 pt-6 border-t-2 border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-slate-700 text-lg">Total Budget:</span>
          <span className="text-slate-900 text-2xl font-medium">
            PKR {totalBudget.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
