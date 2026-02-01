import React, { useState, useMemo } from 'react';
import { VirtualList, VirtualGrid } from '../components/virtual';
import { ChevronLeft, Search, Filter } from 'lucide-react';

/**
 * Virtual Scrolling Demo Page
 * 
 * Demonstrates virtual scrolling performance with 10,000+ items
 * This page showcases the implementation and performance benefits
 */

type DemoItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  timestamp: string;
};

export default function VirtualScrollingDemoPage() {
  const [itemCount, setItemCount] = useState(10000);
  const [demoType, setDemoType] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Generate large dataset
  const allItems = useMemo<DemoItem[]>(() => {
    console.time('Generate dataset');
    const items = Array.from({ length: itemCount }, (_, i) => ({
      id: i,
      title: `Item ${i + 1}`,
      description: `This is a detailed description for item ${i + 1}. It demonstrates how virtual scrolling handles large datasets efficiently.`,
      category: ['Technology', 'Education', 'Health', 'Environment', 'Community'][i % 5],
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    }));
    console.timeEnd('Generate dataset');
    return items;
  }, [itemCount]);

  // Filter items
  const filteredItems = useMemo(() => {
    console.time('Filter items');
    let result = allItems;
    
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    console.timeEnd('Filter items');
    return result;
  }, [allItems, searchQuery, categoryFilter]);

  const categories = ['Technology', 'Education', 'Health', 'Environment', 'Community'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Virtual Scrolling Demo</h1>
              <p className="text-sm text-gray-600">Performance test with {itemCount.toLocaleString()} items</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            {/* Item Count Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Items:</label>
              <select
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={100}>100</option>
                <option value={1000}>1,000</option>
                <option value={5000}>5,000</option>
                <option value={10000}>10,000</option>
                <option value={25000}>25,000</option>
                <option value={50000}>50,000</option>
              </select>
            </div>

            {/* Demo Type Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">View:</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDemoType('list')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    demoType === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setDemoType('grid')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    demoType === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="text-gray-600">Total Items:</span>{' '}
              <span className="font-semibold text-gray-900">{allItems.length.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Filtered Items:</span>{' '}
              <span className="font-semibold text-gray-900">{filteredItems.length.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Rendered DOM Nodes:</span>{' '}
              <span className="font-semibold text-green-600">~20-50</span>
              <span className="text-xs text-gray-500 ml-1">(virtualized)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {demoType === 'list' ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <VirtualList
              items={filteredItems}
              height={800}
              itemHeight={120}
              renderItem={(item, index, style) => (
                <div 
                  key={item.id} 
                  style={{ ...style, padding: '16px', borderBottom: '1px solid #e5e7eb' }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 ml-4">#{item.id}</div>
                  </div>
                </div>
              )}
            />
          </div>
        ) : (
          <VirtualGrid
            items={filteredItems}
            height={800}
            width="100%"
            columnCount={window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1}
            rowHeight={200}
            columnWidth={window.innerWidth >= 1280 ? 380 : window.innerWidth >= 768 ? 480 : 750}
            renderItem={(item, index, style) => (
              <div key={item.id} style={{ ...style, padding: '12px' }}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">#{item.id}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          />
        )}
      </div>

      {/* Performance Info */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">🚀 Performance Benefits</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-900 mb-1">Low DOM Nodes</p>
              <p className="text-blue-700">Only renders visible items (~20-50 nodes) regardless of total dataset size</p>
            </div>
            <div>
              <p className="font-medium text-blue-900 mb-1">Fast Scrolling</p>
              <p className="text-blue-700">Smooth 60fps scrolling even with 50,000+ items</p>
            </div>
            <div>
              <p className="font-medium text-blue-900 mb-1">Efficient Filtering</p>
              <p className="text-blue-700">Search and filter operations remain fast with large datasets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
