import React, { useState } from 'react';
import { 
  Target, Image as ImageIcon, Video, FileText, Plus,
  CheckCircle, Clock, PlayCircle, Download, Tag, Upload,
  GripVertical, Calendar, User, Paperclip, Eye, X, ChevronLeft, ChevronRight,
  Lock, Globe, Users as UsersIcon, Copy, Check
} from 'lucide-react';
import { AddMilestoneModal } from '../modals/AddMilestoneModal';
import { UploadMediaModal } from '../modals/UploadMediaModal';
import { UploadEvidenceModal } from '../modals/UploadEvidenceModal';

interface MilestonesMediaTabProps {
  projectId: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'ongoing' | 'completed';
  dueDate: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  progress: number;
  deliverables?: string[];
  evidenceRequired: boolean;
  order: number;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  title: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
  tags: string[];
  milestoneId?: string;
  size: string;
  permission: 'public' | 'private' | 'internal';
  caption?: string;
}

// Mock data
const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'ms_1',
    title: 'Site Preparation and Planning',
    description: 'Complete site survey, obtain permissions, and finalize implementation plan',
    status: 'completed',
    dueDate: '2026-02-10',
    assignee: {
      id: 'u1',
      name: 'Ahmed Hassan',
      avatar: undefined
    },
    progress: 100,
    deliverables: ['Site survey report', 'Permission documents', 'Implementation plan'],
    evidenceRequired: true,
    order: 0
  },
  {
    id: 'ms_2',
    title: 'Volunteer Recruitment and Training',
    description: 'Recruit volunteers, conduct orientation sessions, and safety training',
    status: 'ongoing',
    dueDate: '2026-02-14',
    assignee: {
      id: 'u2',
      name: 'Sana Malik'
    },
    progress: 65,
    deliverables: ['Volunteer roster', 'Training materials', 'Safety certifications'],
    evidenceRequired: true,
    order: 1
  },
  {
    id: 'ms_3',
    title: 'Community Cleanup Event - Day 1',
    description: 'Execute first day of cleanup activities in Clifton area',
    status: 'planned',
    dueDate: '2026-02-15',
    assignee: {
      id: 'u1',
      name: 'Ahmed Hassan'
    },
    progress: 0,
    deliverables: ['Before photos', 'Waste collection logs', 'Volunteer attendance'],
    evidenceRequired: true,
    order: 2
  },
  {
    id: 'ms_4',
    title: 'Impact Assessment and Reporting',
    description: 'Document impact, compile data, and prepare final report',
    status: 'planned',
    dueDate: '2026-02-25',
    assignee: {
      id: 'u3',
      name: 'Bilal Khan'
    },
    progress: 0,
    deliverables: ['Impact report', 'Photo documentation', 'Beneficiary feedback'],
    evidenceRequired: true,
    order: 3
  }
];

const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'media_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    title: 'Site survey - Before cleanup',
    uploadedBy: { id: 'u1', name: 'Ahmed Hassan' },
    uploadedAt: '2026-02-08T10:30:00Z',
    tags: ['before', 'site-survey'],
    milestoneId: 'ms_1',
    size: '2.4 MB',
    permission: 'public',
    caption: 'Initial site condition showing accumulation of waste along the coastal area'
  },
  {
    id: 'media_2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400',
    title: 'Volunteer orientation session',
    uploadedBy: { id: 'u2', name: 'Sana Malik' },
    uploadedAt: '2026-02-12T14:15:00Z',
    tags: ['training', 'volunteers'],
    milestoneId: 'ms_2',
    size: '3.1 MB',
    permission: 'internal',
    caption: 'Training session covering safety protocols and waste handling procedures'
  },
  {
    id: 'media_3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400',
    title: 'Safety equipment distribution',
    uploadedBy: { id: 'u2', name: 'Sana Malik' },
    uploadedAt: '2026-02-13T09:00:00Z',
    tags: ['safety', 'equipment'],
    milestoneId: 'ms_2',
    size: '1.8 MB',
    permission: 'private',
    caption: 'Distribution of protective gear to volunteer team members'
  },
  {
    id: 'media_4',
    type: 'document',
    url: '#',
    title: 'Site permission documents.pdf',
    uploadedBy: { id: 'u1', name: 'Ahmed Hassan' },
    uploadedAt: '2026-02-09T11:20:00Z',
    tags: ['documents', 'permissions'],
    milestoneId: 'ms_1',
    size: '456 KB',
    permission: 'internal'
  },
  {
    id: 'media_5',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=400',
    title: 'Training session highlights',
    uploadedBy: { id: 'u2', name: 'Sana Malik' },
    uploadedAt: '2026-02-12T16:30:00Z',
    tags: ['video', 'training'],
    milestoneId: 'ms_2',
    size: '15.7 MB',
    permission: 'public',
    caption: 'Key moments from volunteer training and safety briefing'
  },
  {
    id: 'media_6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400',
    title: 'Team photo - Volunteer group',
    uploadedBy: { id: 'u1', name: 'Ahmed Hassan' },
    uploadedAt: '2026-02-13T17:00:00Z',
    tags: ['team', 'volunteers', 'after'],
    size: '2.9 MB',
    permission: 'public',
    caption: 'Volunteer team ready for community cleanup initiative'
  }
];

export function MilestonesMediaTab({ projectId }: MilestonesMediaTabProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [uploadMediaOpen, setUploadMediaOpen] = useState(false);
  const [uploadEvidenceOpen, setUploadEvidenceOpen] = useState(false);
  const [selectedMilestoneForEvidence, setSelectedMilestoneForEvidence] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [mediaTagFilter, setMediaTagFilter] = useState<string>('all');
  const [mediaPermissionFilter, setMediaPermissionFilter] = useState<'all' | 'public' | 'private' | 'internal'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [draggedMilestone, setDraggedMilestone] = useState<string | null>(null);

  const handleMarkComplete = (milestone: Milestone) => {
    if (milestone.evidenceRequired) {
      setSelectedMilestoneForEvidence(milestone.id);
      setUploadEvidenceOpen(true);
    } else {
      setMilestones((prev: Milestone[]) => prev.map((m: Milestone) =>
        m.id === milestone.id ? { ...m, status: 'completed' as const, progress: 100 } : m
      ));
    }
  };

  const handleEvidenceUploaded = (milestoneId: string) => {
    setMilestones((prev: Milestone[]) => prev.map((m: Milestone) =>
      m.id === milestoneId ? { ...m, status: 'completed' as const, progress: 100 } : m
    ));
    setUploadEvidenceOpen(false);
    setSelectedMilestoneForEvidence(null);
  };

  const handleDragStart = (e: React.DragEvent, milestoneId: string) => {
    setDraggedMilestone(milestoneId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedMilestone || draggedMilestone === targetId) return;

    const draggedIndex = milestones.findIndex((m: Milestone) => m.id === draggedMilestone);
    const targetIndex = milestones.findIndex((m: Milestone) => m.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newMilestones = [...milestones];
    const [removed] = newMilestones.splice(draggedIndex, 1);
    newMilestones.splice(targetIndex, 0, removed);

    // Update order property
    const updatedMilestones = newMilestones.map((m, idx) => ({ ...m, order: idx }));

    setMilestones(updatedMilestones);
    setDraggedMilestone(null);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Get all unique tags from media
  const allTags = Array.from(new Set(media.flatMap((m: MediaItem) => m.tags)));

  // Filter media
  let filteredMedia = media.filter((m: MediaItem) => {
    const typeMatch = mediaFilter === 'all' || m.type === mediaFilter;
    const tagMatch = mediaTagFilter === 'all' || m.tags.includes(mediaTagFilter);
    const permissionMatch = mediaPermissionFilter === 'all' || m.permission === mediaPermissionFilter;
    return typeMatch && tagMatch && permissionMatch;
  });

  const imageAndVideoMedia = filteredMedia.filter((m: MediaItem) => m.type === 'image' || m.type === 'video');

  const getStatusConfig = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle };
      case 'ongoing':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  const getPermissionIcon = (permission: MediaItem['permission']) => {
    switch (permission) {
      case 'public':
        return Globe;
      case 'private':
        return Lock;
      case 'internal':
        return UsersIcon;
    }
  };

  const getPermissionLabel = (permission: MediaItem['permission']) => {
    switch (permission) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Private';
      case 'internal':
        return 'Internal Only';
    }
  };

  // Sort milestones by order
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Milestones Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm text-slate-700">Project Milestones</h3>
            <p className="text-xs text-slate-500 mt-0.5">Drag to reorder milestones</p>
          </div>
          <button
            onClick={() => setAddMilestoneOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>

        <div className="space-y-3">
          {sortedMilestones.map((milestone) => {
            const statusConfig = getStatusConfig(milestone.status);
            const StatusIcon = statusConfig.icon;
            const linkedMedia = media.filter((m: MediaItem) => m.milestoneId === milestone.id);

            return (
              <div
                key={milestone.id}
                draggable
                onDragStart={(e: React.DragEvent) => handleDragStart(e, milestone.id)}
                onDragOver={handleDragOver}
                onDrop={(e: React.DragEvent) => handleDrop(e, milestone.id)}
                className={`p-4 bg-white border-2 rounded-xl transition-all cursor-move ${
                  draggedMilestone === milestone.id 
                    ? 'border-teal-300 shadow-lg opacity-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 mt-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-900 truncate">{milestone.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {milestone.evidenceRequired && (
                          <span className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded border border-blue-200">
                            Evidence Required
                          </span>
                        )}
                        <div className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border-2 text-xs ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{milestone.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due {formatDate(milestone.dueDate)}</span>
                      </div>
                      
                      {milestone.assignee && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <User className="w-3.5 h-3.5" />
                          <span>{milestone.assignee.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Progress</span>
                        <span className="text-xs text-slate-900">{milestone.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'ongoing' ? 'bg-yellow-500' :
                            'bg-slate-400'
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Deliverables */}
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Expected Deliverables:</p>
                        <ul className="space-y-0.5">
                          {milestone.deliverables.map((deliverable: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-slate-400" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Linked Media */}
                    {linkedMedia.length > 0 && (
                      <div className="mb-3 p-2 bg-teal-50 border border-teal-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Paperclip className="w-3 h-3 text-teal-600" />
                          <p className="text-xs text-teal-900">{linkedMedia.length} media file{linkedMedia.length > 1 ? 's' : ''} attached</p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {linkedMedia.slice(0, 3).map((m: MediaItem) => (
                            <span key={m.id} className="text-xs text-teal-700 bg-white px-2 py-0.5 rounded">
                              {m.title.length > 20 ? m.title.substring(0, 20) + '...' : m.title}
                            </span>
                          ))}
                          {linkedMedia.length > 3 && (
                            <span className="text-xs text-teal-700">+{linkedMedia.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {milestone.status !== 'completed' && (
                        <button
                          onClick={() => handleMarkComplete(milestone)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {milestone.evidenceRequired ? 'Upload Evidence & Complete' : 'Mark Complete'}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          setSelectedMilestoneForEvidence(milestone.id);
                          setUploadMediaOpen(true);
                        }}
                        className="px-3 py-2 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-colors"
                        title="Attach media"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Media Gallery Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-slate-700">Media Gallery</h3>
          <button
            onClick={() => setUploadMediaOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:border-teal-300 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3 mb-4">
          {/* Type Filters */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Media Type</label>
            <div className="flex gap-2">
              {(['all', 'image', 'video', 'document'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setMediaFilter(filter)}
                  className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors capitalize ${
                    mediaFilter === filter
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {filter === 'all' ? 'All Media' : `${filter}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Tags</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setMediaTagFilter('all')}
                  className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors ${
                    mediaTagFilter === 'all'
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setMediaTagFilter(tag)}
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors ${
                      mediaTagFilter === tag
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Permission Filters */}
          <div>
            <label className="block text-xs text-slate-600 mb-1.5">Visibility</label>
            <div className="flex gap-2">
              {(['all', 'public', 'internal', 'private'] as const).map(filter => {
                const PermIcon = filter !== 'all' ? getPermissionIcon(filter) : null;
                return (
                  <button
                    key={filter}
                    onClick={() => setMediaPermissionFilter(filter)}
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors capitalize flex items-center gap-1.5 ${
                      mediaPermissionFilter === filter
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {PermIcon && <PermIcon className="w-3 h-3" />}
                    {filter === 'all' ? 'All' : getPermissionLabel(filter)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredMedia.map((item: MediaItem) => {
            const PermIcon = getPermissionIcon(item.permission);
            
            return (
              <div 
                key={item.id}
                className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-teal-300 transition-all"
              >
                {item.type === 'image' && (
                  <button
                    onClick={() => openLightbox(imageAndVideoMedia.findIndex((m: MediaItem) => m.id === item.id))}
                    className="w-full h-full"
                  >
                    <img 
                      src={item.thumbnail || item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                )}

                {item.type === 'video' && (
                  <button
                    onClick={() => openLightbox(imageAndVideoMedia.findIndex((m: MediaItem) => m.id === item.id))}
                    className="w-full h-full relative"
                  >
                    {item.thumbnail && (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </button>
                )}

                {item.type === 'document' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200">
                    <FileText className="w-12 h-12 text-slate-600 mb-2" />
                    <p className="text-xs text-slate-700 text-center truncate w-full">{item.title}</p>
                  </div>
                )}

                {/* Permission Badge */}
                <div className="absolute top-2 right-2">
                  <div className={`p-1.5 rounded-full ${
                    item.permission === 'public' ? 'bg-green-500' :
                    item.permission === 'internal' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} title={getPermissionLabel(item.permission)}>
                    <PermIcon className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white truncate">{item.title}</p>
                  <p className="text-xs text-slate-300">{formatTimeAgo(item.uploadedAt)}</p>
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.tags.slice(0, 2).map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-2 py-0.5 bg-slate-900/80 text-white text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredMedia.length === 0 && (
          <div className="py-12 text-center">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No media matches your filters</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && imageAndVideoMedia.length > 0 && (
        <Lightbox
          media={imageAndVideoMedia}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
          milestones={milestones}
        />
      )}

      {/* Modals */}
      <AddMilestoneModal
        isOpen={addMilestoneOpen}
        onClose={() => setAddMilestoneOpen(false)}
        onAdd={(milestone: any) => {
          setMilestones((prev: Milestone[]) => [...prev, { 
            ...milestone, 
            id: `ms_${Date.now()}`,
            order: prev.length
          }]);
          setAddMilestoneOpen(false);
        }}
      />

      <UploadMediaModal
        isOpen={uploadMediaOpen}
        onClose={() => {
          setUploadMediaOpen(false);
          setSelectedMilestoneForEvidence(null);
        }}
        onUpload={(files) => {
          // Handle upload
          setUploadMediaOpen(false);
          setSelectedMilestoneForEvidence(null);
        }}
        milestones={milestones}
        preselectedMilestone={selectedMilestoneForEvidence}
      />

      <UploadEvidenceModal
        isOpen={uploadEvidenceOpen}
        onClose={() => {
          setUploadEvidenceOpen(false);
          setSelectedMilestoneForEvidence(null);
        }}
        milestoneId={selectedMilestoneForEvidence || ''}
        milestoneName={milestones.find((m: Milestone) => m.id === selectedMilestoneForEvidence)?.title || ''}
        onUploadComplete={handleEvidenceUploaded}
      />
    </div>
  );
}

// Lightbox Component
interface LightboxProps {
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  milestones: Milestone[];
}

function Lightbox({ media, currentIndex, onClose, onNavigate, milestones }: LightboxProps) {
  const currentMedia = media[currentIndex];
  const [copied, setCopied] = useState(false);

  const handlePrev = () => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : media.length - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex < media.length - 1 ? currentIndex + 1 : 0);
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/projects/media/${currentMedia.id}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentMedia.url;
    link.download = currentMedia.title;
    link.click();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const linkedMilestone = currentMedia.milestoneId 
    ? milestones.find(m => m.id === currentMedia.milestoneId)
    : null;

  const PermIcon = getPermissionIcon(currentMedia.permission);

  const getPermissionIcon = (permission: MediaItem['permission']) => {
    switch (permission) {
      case 'public':
        return Globe;
      case 'private':
        return Lock;
      case 'internal':
        return UsersIcon;
    }
  };

  const getPermissionLabel = (permission: MediaItem['permission']) => {
    switch (permission) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Private';
      case 'internal':
        return 'Internal Only';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
        aria-label="Close lightbox (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation */}
      {media.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Previous (←)"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Next (→)"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 text-white text-sm rounded-lg">
            {currentIndex + 1} / {media.length}
          </div>
        </>
      )}

      {/* Media Content */}
      <div className="max-w-6xl max-h-[90vh] w-full mx-4 flex items-center justify-center">
        {currentMedia.type === 'image' && (
          <img 
            src={currentMedia.url}
            alt={currentMedia.title}
            className="max-w-full max-h-[80vh] object-contain"
          />
        )}

        {currentMedia.type === 'video' && (
          <video 
            src={currentMedia.url}
            controls
            autoPlay
            className="max-w-full max-h-[80vh]"
          />
        )}
      </div>

      {/* Metadata Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h4 className="text-white mb-1">{currentMedia.title}</h4>
              {currentMedia.caption && (
                <p className="text-sm text-slate-300">{currentMedia.caption}</p>
              )}
            </div>

            {/* Permission Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              currentMedia.permission === 'public' ? 'bg-green-500/20 text-green-300' :
              currentMedia.permission === 'internal' ? 'bg-blue-500/20 text-blue-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              <PermIcon className="w-3.5 h-3.5" />
              <span className="text-xs">{getPermissionLabel(currentMedia.permission)}</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mb-3">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{currentMedia.uploadedBy.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(currentMedia.uploadedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <span>•</span>
            <span>{currentMedia.size}</span>
            {linkedMilestone && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>{linkedMilestone.title}</span>
                </div>
              </>
            )}
          </div>
          
          {/* Tags */}
          {currentMedia.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex gap-2 flex-wrap">
                {currentMedia.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>

            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
