import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * Admin Dashboard Charts
 * 
 * Two key charts for admin overview:
 * 1. QueueDepthChart - Shows vetting requests by status over time
 * 2. VettingTimeHistogram - Shows distribution of vetting completion times
 */

// ====================
// QUEUE DEPTH CHART
// ====================

export type QueueDepthData = {
  date: string;
  pending: number;
  approved: number;
  rejected: number;
  conditional: number;
};

export type QueueDepthChartProps = {
  data: QueueDepthData[];
  className?: string;
};

export function QueueDepthChart({ data, className = '' }: QueueDepthChartProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm text-gray-900">Queue Depth (Last 7 Days)</h3>
        <p className="text-xs text-gray-500 mt-1">Vetting requests by status over time</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Bar dataKey="pending" name="Pending" stackId="a" fill="#3b82f6" />
          <Bar dataKey="approved" name="Approved" stackId="a" fill="#10b981" />
          <Bar dataKey="conditional" name="Conditional" stackId="a" fill="#f59e0b" />
          <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-600">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-500 rounded" />
          <span className="text-gray-600">Approved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-500 rounded" />
          <span className="text-gray-600">Conditional</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-600">Rejected</span>
        </div>
      </div>
    </div>
  );
}

// ====================
// VETTING TIME HISTOGRAM
// ====================

export type VettingTimeData = {
  range: string;
  count: number;
  label: string;
};

export type VettingTimeHistogramProps = {
  data: VettingTimeData[];
  className?: string;
};

export function VettingTimeHistogram({ data, className = '' }: VettingTimeHistogramProps) {
  // Color code based on performance
  const getBarColor = (range: string) => {
    const days = parseInt(range.split('-')[0]);
    if (days <= 2) return '#10b981'; // Green - excellent
    if (days <= 4) return '#3b82f6'; // Blue - good
    if (days <= 7) return '#f59e0b'; // Amber - acceptable
    return '#ef4444'; // Red - slow
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm text-gray-900">Vetting Time Distribution</h3>
        <p className="text-xs text-gray-500 mt-1">Days to complete vetting (last 30 days)</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`${value} requests`, 'Count']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Performance Indicators */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="text-center">
          <div className="w-full h-2 bg-emerald-500 rounded mb-1" />
          <p className="text-xs text-gray-600">Excellent</p>
          <p className="text-xs text-gray-500">0-2 days</p>
        </div>
        <div className="text-center">
          <div className="w-full h-2 bg-blue-500 rounded mb-1" />
          <p className="text-xs text-gray-600">Good</p>
          <p className="text-xs text-gray-500">3-4 days</p>
        </div>
        <div className="text-center">
          <div className="w-full h-2 bg-amber-500 rounded mb-1" />
          <p className="text-xs text-gray-600">Acceptable</p>
          <p className="text-xs text-gray-500">5-7 days</p>
        </div>
        <div className="text-center">
          <div className="w-full h-2 bg-red-500 rounded mb-1" />
          <p className="text-xs text-gray-600">Slow</p>
          <p className="text-xs text-gray-500">7+ days</p>
        </div>
      </div>
    </div>
  );
}

// ====================
// MOCK DATA GENERATORS
// ====================

export function generateMockQueueDepthData(): QueueDepthData[] {
  const data: QueueDepthData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString(),
      pending: Math.floor(Math.random() * 15) + 10,
      approved: Math.floor(Math.random() * 8) + 3,
      rejected: Math.floor(Math.random() * 4) + 1,
      conditional: Math.floor(Math.random() * 5) + 2,
    });
  }

  return data;
}

export function generateMockVettingTimeData(): VettingTimeData[] {
  return [
    { range: '0-1', label: '0-1 day', count: 12 },
    { range: '1-2', label: '1-2 days', count: 18 },
    { range: '2-3', label: '2-3 days', count: 24 },
    { range: '3-4', label: '3-4 days', count: 15 },
    { range: '4-5', label: '4-5 days', count: 10 },
    { range: '5-7', label: '5-7 days', count: 8 },
    { range: '7+', label: '7+ days', count: 5 },
  ];
}
