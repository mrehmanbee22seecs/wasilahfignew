import React, { useState } from 'react';
import {
  Search,
  Filter,
  Upload,
  Grid3x3,
  List,
  Image as ImageIcon,
  X,
  Check,
  Download,
  Trash2,
  Eye,
  Info,
  Calendar,
  FileText,
  CheckSquare,
  Square,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MediaUploader } from '../../components/cms/MediaUploader';

/**
 * MediaLibrary - Full media management page
 * 
 * Features:
 * - Grid/List view of all images
 * - Search and filters (type, size, date)
 * - Bulk select and operations
 * - Image detail drawer
 * - Usage references
 * - Upload new media
 * - Insert into editor
 * 
 * @accessibility Keyboard navigation, screen reader support
 */

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  size: number; // bytes
  format: string;
  uploadedAt: string;
  uploadedBy: string;
  usedIn: { type: string; title: string; id: string }[];
};

type MediaLibraryProps = {
  onNavigate?: (section: any) => void;
  onInsert?: (media: MediaItem[]) => void;
  selectionMode?: boolean; // If true, shows "Insert Selected" button
};

export default function MediaLibrary({
  onNavigate,
  onInsert,
  selectionMode = false,
}: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600',
      filename: 'education-initiative.jpg',
      alt: 'Students in classroom reading books',
      caption: 'Education initiative in rural Sindh',
      width: 1600,
      height: 900,
      size: 2450000,
      format: 'jpg',
      uploadedAt: '2024-01-05T10:30:00Z',
      uploadedBy: 'Sarah Ahmed',
      usedIn: [
        { type: 'case-study', title: 'Education Initiative - Sindh Schools', id: '1' },
        { type: 'resource', title: 'SDG4 Guide', id: '2' },
      ],
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1600',
      filename: 'healthcare-mobile-clinic.jpg',
      alt: 'Healthcare workers at mobile clinic',
      width: 1600,
      height: 1067,
      size: 3200000,
      format: 'jpg',
      uploadedAt: '2024-01-04T14:20:00Z',
      uploadedBy: 'Ali Khan',
      usedIn: [{ type: 'case-study', title: 'Healthcare Access Punjab', id: '3' }],
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600',
      filename: 'volunteer-team.jpg',
      alt: 'Group of volunteers working together',
      width: 1600,
      height: 900,
      size: 1800000,
      format: 'jpg',
      uploadedAt: '2024-01-03T09:15:00Z',
      uploadedBy: 'Fatima Malik',
      usedIn: [],
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600',
      filename: 'clean-water-project.jpg',
      alt: 'Water well in rural village',
      width: 1600,
      height: 1200,
      size: 2900000,
      format: 'jpg',
      uploadedAt: '2024-01-02T16:45:00Z',
      uploadedBy: 'Ali Khan',
      usedIn: [{ type: 'case-study', title: 'Clean Water Balochistan', id: '4' }],
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedItems.length} items?`)) {
      setItems(items.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items deleted`);
    }
  };

  const handleInsertSelected = () => {
    const selected = items.filter(item => selectedItems.includes(item.id));
    if (onInsert) {
      onInsert(selected);
      toast.success(`${selected.length} image(s) inserted`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = filterFormat === 'all' || item.format === filterFormat;
    const matchesSize = 
      filterSize === 'all' ||
      (filterSize === 'small' && item.size < 1024 * 1024) ||
      (filterSize === 'medium' && item.size >= 1024 * 1024 && item.size < 3 * 1024 * 1024) ||
      (filterSize === 'large' && item.size >= 3 * 1024 * 1024);
    
    return matchesSearch && matchesFormat && matchesSize;
  });

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-1">{filteredItems.length} images</p>
          </div>

          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by filename or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Formats</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="gif">GIF</option>
            </select>

            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sizes</option>
              <option value="small">&lt; 1MB</option>
              <option value="medium">1-3MB</option>
              <option value="large">&gt; 3MB</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            {selectionMode && onInsert && (
              <button
                onClick={handleInsertSelected}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Insert Selected
              </button>
            )}
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Media Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Select All */}
          <div className="mb-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              {selectedItems.length === filteredItems.length ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select All
            </button>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                    selectedItems.includes(item.id)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelect(item.id)}
                >
                  {/* Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedItems.includes(item.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {selectedItems.includes(item.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3 w-full">
                      <p className="text-white text-xs font-medium truncate mb-1">
                        {item.filename}
                      </p>
                      <p className="text-white/80 text-xs">
                        {item.width}×{item.height} • {formatFileSize(item.size)}
                      </p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedia(item);
                      }}
                      className="p-1.5 bg-white rounded shadow-lg hover:bg-gray-50"
                      title="View details"
                    >
                      <Info className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <button onClick={handleSelectAll}>
                        {selectedItems.length === filteredItems.length ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Filename
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Dimensions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Uploaded
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button onClick={() => handleSelect(item.id)}>
                          {selectedItems.includes(item.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{item.filename}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.alt}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.width}×{item.height}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{formatDate(item.uploadedAt)}</p>
                        <p className="text-xs text-gray-500">{item.uploadedBy}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedMedia(item)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="View details"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No media found</p>
            </div>
          )}
        </div>

        {/* Detail Drawer */}
        {selectedMedia && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Image Details</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt}
                  className="w-full rounded-lg"
                />
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Filename
                  </label>
                  <p className="text-sm text-gray-900">{selectedMedia.filename}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <p className="text-sm text-gray-900">{selectedMedia.alt}</p>
                </div>

                {selectedMedia.caption && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Caption
                    </label>
                    <p className="text-sm text-gray-900">{selectedMedia.caption}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dimensions
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedMedia.width}×{selectedMedia.height}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      File Size
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatFileSize(selectedMedia.size)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <p className="text-sm text-gray-900 uppercase">{selectedMedia.format}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Uploaded
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedMedia.uploadedAt)} by {selectedMedia.uploadedBy}
                  </p>
                </div>

                {/* Usage References */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Used In ({selectedMedia.usedIn.length})
                  </label>
                  {selectedMedia.usedIn.length > 0 ? (
                    <div className="space-y-2">
                      {selectedMedia.usedIn.map((usage, i) => (
                        <div
                          key={i}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-xs text-gray-500 uppercase mb-1">{usage.type}</p>
                          <p className="text-sm text-gray-900">{usage.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not used anywhere yet</p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this image?')) {
                        setItems(items.filter(i => i.id !== selectedMedia.id));
                        setSelectedMedia(null);
                        toast.success('Image deleted');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
              <button
                onClick={() => setShowUploader(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaUploader
              onUploadComplete={(files) => {
                // In real app, would process uploaded files
                toast.success(`${files.length} file(s) uploaded`);
                setShowUploader(false);
              }}
              maxFiles={20}
            />
          </div>
        </div>
      )}
    </div>
  );
}
