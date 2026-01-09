import React, { useState, useEffect } from 'react';
import {
  FileText,
  MessageSquareQuote,
  BookOpen,
  Image as ImageIcon,
  Plus,
  TrendingUp,
  Clock,
  Edit,
  Eye,
} from 'lucide-react';

/**
 * CMSDashboard - CMS Home Page
 * 
 * Overview dashboard for content management showing:
 * - Quick stats (draft/published counts)
 * - Recent edits
 * - Quick create buttons
 * - Activity summary
 * 
 * @accessibility Keyboard navigation, semantic HTML
 */

type ContentStat = {
  type: 'testimonials' | 'case-studies' | 'resources';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  draft: number;
  published: number;
  total: number;
  trend: string;
};

type RecentEdit = {
  id: string;
  type: 'testimonial' | 'case-study' | 'resource';
  title: string;
  status: 'draft' | 'published';
  author: string;
  updatedAt: string;
  action: 'created' | 'updated' | 'published';
};

type CMSDashboardProps = {
  onNavigate: (section: any) => void;
};

export default function CMSDashboard({ onNavigate }: CMSDashboardProps) {
  const [stats, setStats] = useState<ContentStat[]>([]);
  const [recentEdits, setRecentEdits] = useState<RecentEdit[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentEdits();
  }, []);

  const loadStats = () => {
    setStats([
      {
        type: 'testimonials',
        label: 'Testimonials',
        icon: MessageSquareQuote,
        draft: 3,
        published: 12,
        total: 15,
        trend: '+2 this week',
      },
      {
        type: 'case-studies',
        label: 'Case Studies',
        icon: BookOpen,
        draft: 5,
        published: 28,
        total: 33,
        trend: '+4 this month',
      },
      {
        type: 'resources',
        label: 'Resources',
        icon: FileText,
        draft: 8,
        published: 45,
        total: 53,
        trend: '+12 this month',
      },
    ]);
  };

  const loadRecentEdits = () => {
    setRecentEdits([
      {
        id: '1',
        type: 'resource',
        title: 'How to Create Impactful CSR Programs in Pakistan',
        status: 'published',
        author: 'Sarah Ahmed',
        updatedAt: '2024-01-07T10:30:00Z',
        action: 'published',
      },
      {
        id: '2',
        type: 'case-study',
        title: 'Education Initiative - Sindh Rural Schools',
        status: 'draft',
        author: 'Ali Khan',
        updatedAt: '2024-01-07T09:15:00Z',
        action: 'updated',
      },
      {
        id: '3',
        type: 'testimonial',
        title: 'Testimonial from Green Pakistan Foundation',
        status: 'published',
        author: 'Fatima Malik',
        updatedAt: '2024-01-06T16:45:00Z',
        action: 'created',
      },
      {
        id: '4',
        type: 'resource',
        title: 'UN SDG Alignment Guide for Corporates',
        status: 'draft',
        author: 'Sarah Ahmed',
        updatedAt: '2024-01-06T14:20:00Z',
        action: 'updated',
      },
      {
        id: '5',
        type: 'case-study',
        title: 'Healthcare Access - Punjab Mobile Clinics',
        status: 'published',
        author: 'Ali Khan',
        updatedAt: '2024-01-06T11:00:00Z',
        action: 'published',
      },
    ]);
  };

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      testimonial: 'Testimonial',
      'case-study': 'Case Study',
      resource: 'Resource',
    };
    return labels[type] || type;
  };

  const getActionText = (action: string) => {
    const actions: Record<string, string> = {
      created: 'Created',
      updated: 'Updated',
      published: 'Published',
    };
    return actions[action] || action;
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">
              Manage testimonials, case studies, and resources
            </p>
          </div>

          {/* Quick Create Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              <Plus className="w-5 h-5" />
              Create New
            </button>
            
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="py-1">
                <button
                  onClick={() => onNavigate('/admin/cms/testimonials/new')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <MessageSquareQuote className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Testimonial</p>
                    <p className="text-xs text-gray-500">Homepage testimonial block</p>
                  </div>
                </button>
                
                <button
                  onClick={() => onNavigate('/admin/cms/case-studies/new')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Case Study</p>
                    <p className="text-xs text-gray-500">Project success story</p>
                  </div>
                </button>
                
                <button
                  onClick={() => onNavigate('/admin/cms/resources/new')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Resource</p>
                    <p className="text-xs text-gray-500">Article or guide</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.type}
                onClick={() => onNavigate(`/admin/cms/${stat.type}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</h3>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <span className="text-gray-600">
                    <span className="font-medium text-amber-600">{stat.draft}</span> draft
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium text-green-600">{stat.published}</span> published
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-gray-900">{stat.total}</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {stat.trend}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Edits (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button
                onClick={() => onNavigate('/admin/cms/resources')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {recentEdits.map((edit) => (
                <div
                  key={edit.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate(`/admin/cms/${edit.type}s/${edit.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {getTypeLabel(edit.type)}
                        </span>
                        <span
                          className={`
                            px-2 py-0.5 text-xs font-medium rounded
                            ${
                              edit.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {edit.status}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {edit.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{getActionText(edit.action)} by {edit.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(edit.updatedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/admin/cms/${edit.type}s/${edit.id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Preview action
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links (1/3 width) */}
          <div className="space-y-6">
            {/* Media Library */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Media Library</h3>
                  <p className="text-xs text-gray-500">234 images</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/admin/cms/media')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Browse Library
              </button>
            </div>

            {/* Content Tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-medium text-blue-900 mb-2">Content Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Always add alt text to images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Keep meta descriptions under 160 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Use audit notes when publishing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Preview on mobile before publishing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}