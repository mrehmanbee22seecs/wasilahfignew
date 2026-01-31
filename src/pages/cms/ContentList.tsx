import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit, Trash2, Copy, ChevronDown, Grid3x3, List, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '../../components/cms/Pagination';

/**
 * ContentList - Unified list view for all content types
 * 
 * Features:
 * - Search and filters
 * - Table/Card view toggle
 * - Inline actions
 * - Bulk operations
 * - Pagination
 * - Soft delete with undo
 * 
 * Used for: Testimonials, Case Studies, Resources
 */

type ContentItem = {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'published' | 'scheduled';
  author: string;
  updatedAt: string;
  publishedAt?: string;
  tags?: string[];
};

type ContentListProps = {
  contentType?: string;
  onNavigate?: (section: any) => void;
};

export default function ContentList({ contentType = 'resources', onNavigate }: ContentListProps) {
  const navigate = (path: string) => {
    // In real app with routing, this would navigate
    // For now, use onNavigate callback if provided
    if (onNavigate) {
      onNavigate('cms-editor');
    }
  };
  
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletedItems, setDeletedItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    loadItems();
  }, [contentType, statusFilter]);

  const loadItems = () => {
    // Mock data based on content type
    const mockData: ContentItem[] = [
      {
        id: '1',
        title: 'How to Create Impactful CSR Programs in Pakistan',
        type: contentType,
        status: 'published',
        author: 'Sarah Ahmed',
        updatedAt: '2024-01-07T10:30:00Z',
        publishedAt: '2024-01-07T10:30:00Z',
        tags: ['CSR', 'Guide', 'Best Practices'],
      },
      {
        id: '2',
        title: 'Education Initiative - Sindh Rural Schools',
        type: contentType,
        status: 'draft',
        author: 'Ali Khan',
        updatedAt: '2024-01-07T09:15:00Z',
        tags: ['Education', 'SDG4'],
      },
      {
        id: '3',
        title: 'Healthcare Access - Punjab Mobile Clinics',
        type: contentType,
        status: 'published',
        author: 'Ali Khan',
        updatedAt: '2024-01-06T11:00:00Z',
        publishedAt: '2024-01-06T11:00:00Z',
        tags: ['Healthcare', 'SDG3'],
      },
      {
        id: '4',
        title: 'UN SDG Alignment Guide for Corporates',
        type: contentType,
        status: 'draft',
        author: 'Sarah Ahmed',
        updatedAt: '2024-01-06T14:20:00Z',
        tags: ['SDG', 'Corporate'],
      },
      {
        id: '5',
        title: 'Clean Water Project - Balochistan Villages',
        type: contentType,
        status: 'scheduled',
        author: 'Fatima Malik',
        updatedAt: '2024-01-05T16:00:00Z',
        tags: ['Water', 'SDG6'],
      },
    ];

    setItems(mockData);
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      testimonials: 'Testimonials',
      'case-studies': 'Case Studies',
      resources: 'Resources',
    };
    return labels[contentType] || 'Content';
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((i) => i.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDuplicate = (id: string) => {
    toast.success('Item duplicated');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const itemToDelete = items.find((i) => i.id === id);
      if (itemToDelete) {
        setDeletedItems([...deletedItems, itemToDelete]);
      }
      setItems(items.filter((i) => i.id !== id));
      toast.success('Item deleted');
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedItems.length} items?`)) {
      const itemsToDelete = items.filter((i) => selectedItems.includes(i.id));
      setDeletedItems([...deletedItems, ...itemsToDelete]);
      setItems(items.filter((i) => !selectedItems.includes(i.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items deleted`);
    }
  };

  const handleBulkPublish = () => {
    toast.success(`${selectedItems.length} items published`);
    setSelectedItems([]);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{getTypeLabel()}</h1>
            <p className="text-gray-600 mt-1">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <button
            onClick={() => navigate(`/admin/cms/${contentType}/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                More Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${
                    viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 ${
                    viewMode === 'card' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="px-4 py-2 border border-gray-200 rounded-lg">
                <option>All Authors</option>
                <option>Sarah Ahmed</option>
                <option>Ali Khan</option>
                <option>Fatima Malik</option>
              </select>
              
              <input
                type="date"
                placeholder="From Date"
                className="px-4 py-2 border border-gray-200 rounded-lg"
              />
              
              <input
                type="date"
                placeholder="To Date"
                className="px-4 py-2 border border-gray-200 rounded-lg"
              />
              
              <select className="px-4 py-2 border border-gray-200 rounded-lg">
                <option>All Tags</option>
                <option>SDG1</option>
                <option>SDG3</option>
                <option>SDG4</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkPublish}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Publish
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Content List */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left w-12">
                    <button onClick={handleSelectAll}>
                      {selectedItems.length === items.length ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelect(item.id)}>
                        {selectedItems.includes(item.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        {item.tags && (
                          <div className="flex gap-1 mt-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex px-2 py-1 text-xs font-medium rounded
                          ${
                            item.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/cms/${contentType}/${item.id}`)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(item.id)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <button onClick={() => handleSelect(item.id)}>
                    {selectedItems.includes(item.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`
                      px-2 py-1 text-xs font-medium rounded
                      ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  <p>By {item.author}</p>
                  <p>{formatDate(item.updatedAt)}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/cms/${contentType}/${item.id}`)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(item.id)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}