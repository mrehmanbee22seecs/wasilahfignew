import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, MoreVertical, Edit, Copy, Archive, Eye, CheckSquare, Square, Share2, MapPin, ChevronDown, X } from 'lucide-react';
import { CreateProjectModal } from '../components/projects/CreateProjectModal';
import { ProjectDetailDrawer } from '../components/projects/ProjectDetailDrawer';
import { ShareProjectModal } from '../components/projects/ShareProjectModal';
import { EmptyProjectsIllustration, NoResultsIllustration } from '../components/projects/EmptyProjectsIllustration';
import { mockProjects } from '../data/mockProjects';
import { SDG_LIST } from '../types/projects';
import type { Project, ProjectStatus, ProjectFilters, CreateProjectRequest } from '../types/projects';

// Pakistani cities with coordinates
const PAKISTANI_CITIES = [
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', lat: 31.4504, lng: 73.1350 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
  { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lng: 66.9750 },
  { name: 'Sialkot', lat: 32.4945, lng: 74.5229 },
  { name: 'Gujranwala', lat: 32.1877, lng: 74.1945 },
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
  const [sdgFilter, setSDGFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [radiusFilter, setRadiusFilter] = useState(50); // km
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [hasViewedDrawer, setHasViewedDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, sdgFilter, projects]);

  const applyFilters = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(p => statusFilter.includes(p.status));
    }

    // SDG filter
    if (sdgFilter.length > 0) {
      filtered = filtered.filter(p =>
        p.sdgs.some(sdg => sdgFilter.includes(sdg))
      );
    }

    // Location filter
    if (locationFilter) {
      const city = PAKISTANI_CITIES.find(c => c.name.toLowerCase() === locationFilter.toLowerCase());
      if (city) {
        filtered = filtered.filter(p => {
          const projectCity = PAKISTANI_CITIES.find(c => c.name.toLowerCase() === p.location.city.toLowerCase());
          if (projectCity) {
            const distance = getDistance(city.lat, city.lng, projectCity.lat, projectCity.lng);
            return distance <= radiusFilter;
          }
          return false;
        });
      }
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const handleCreateProject = (projectData: CreateProjectRequest) => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      ...projectData,
      status: 'draft',
      media_ids: projectData.media_ids || [],
      documents_ids: projectData.documents_ids || [],
      created_by: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProjects([newProject, ...projects]);
    setShowCreateModal(false);
    
    // Show success toast (in production, use proper toast library)
    alert('Project created successfully!');
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetailDrawer(true);
    setHasViewedDrawer(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowCreateModal(true);
  };

  const handleDuplicateProject = (project: Project) => {
    if (confirm(`Duplicate project "${project.title}"?`)) {
      const duplicated: Project = {
        ...project,
        id: `proj_${Date.now()}`,
        title: `${project.title} (Copy)`,
        slug: `${project.slug}-copy`,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProjects([duplicated, ...projects]);
      alert('Project duplicated successfully!');
    }
  };

  const handleArchiveProject = (projectId: string) => {
    if (confirm('Archive this project? It will be hidden from the active list.')) {
      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, status: 'archived' as ProjectStatus } : p
      ));
      alert('Project archived successfully!');
    }
  };

  const handleUnarchiveProject = (projectId: string) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, status: 'active' as ProjectStatus } : p
    ));
    alert('Project restored successfully!');
  };

  const handleBulkArchive = () => {
    if (confirm(`Archive ${selectedRows.length} selected projects?`)) {
      setProjects(projects.map(p =>
        selectedRows.includes(p.id) ? { ...p, status: 'archived' as ProjectStatus } : p
      ));
      setSelectedRows([]);
      alert(`${selectedRows.length} projects archived successfully!`);
    }
  };

  const handleBulkExport = () => {
    const selectedProjects = projects.filter(p => selectedRows.includes(p.id));
    exportToCSV(selectedProjects);
    alert(`${selectedRows.length} projects exported to CSV!`);
  };

  const exportToCSV = (projectsToExport: Project[] = filteredProjects) => {
    const headers = ['Title', 'Status', 'Location', 'Start Date', 'End Date', 'Budget (PKR)', 'SDGs'];
    const rows = projectsToExport.map(p => [
      p.title,
      p.status,
      p.location.city,
      p.start_date,
      p.end_date,
      p.budget.toString(),
      p.sdgs.join(';')
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareProject = (project: Project) => {
    setSelectedProject(project);
    setShowShareModal(true);
  };

  const toggleRowSelection = (projectId: string) => {
    setSelectedRows(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredProjects.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredProjects.map(p => p.id));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
    setSDGFilter([]);
    setLocationFilter('');
    setRadiusFilter(50);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'archived': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedProjects(filteredProjects.slice(startIndex, endIndex));
  }, [currentPage, pageSize, filteredProjects]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-slate-900">Projects</h1>
              <p className="text-slate-600 mt-1">
                Manage your CSR projects and track impact
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedProject(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-600 mb-1">Total Projects</p>
              <p className="text-2xl text-slate-900">{projects.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs text-green-600 mb-1">Active</p>
              <p className="text-2xl text-green-700">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <p className="text-xs text-yellow-600 mb-1">Pending</p>
              <p className="text-2xl text-yellow-700">
                {projects.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Completed</p>
              <p className="text-2xl text-blue-700">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, description, or location..."
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                showFilters ? 'bg-teal-50 border-teal-600 text-teal-700' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(statusFilter.length > 0 || sdgFilter.length > 0) && (
                <span className="px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                  {statusFilter.length + sdgFilter.length}
                </span>
              )}
            </button>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {selectedRows.length} selected
                </span>
                <button 
                  onClick={handleBulkExport}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Export
                </button>
                <button 
                  onClick={handleBulkArchive}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Archive Selected
                </button>
              </div>
            )}

            {/* Export */}
            <button 
              onClick={() => exportToCSV()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-slate-200">
              {/* Status Filter */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['draft', 'pending', 'active', 'completed', 'archived'] as ProjectStatus[]).map(status => (
                    <label
                      key={status}
                      className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm capitalize ${
                        statusFilter.includes(status)
                          ? 'bg-teal-50 border-teal-600 text-teal-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStatusFilter([...statusFilter, status]);
                          } else {
                            setStatusFilter(statusFilter.filter(s => s !== status));
                          }
                        }}
                        className="sr-only"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              {/* SDG Filter */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">SDGs</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {SDG_LIST.slice(0, 10).map(sdg => (
                    <label
                      key={sdg.id}
                      className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-xs ${
                        sdgFilter.includes(sdg.id)
                          ? 'bg-teal-50 border-teal-600 text-teal-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sdgFilter.includes(sdg.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSDGFilter([...sdgFilter, sdg.id]);
                          } else {
                            setSDGFilter(sdgFilter.filter(s => s !== sdg.id));
                          }
                        }}
                        className="sr-only"
                      />
                      SDG {sdg.id}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  {locationFilter && (
                    <button
                      onClick={() => setLocationFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {locationFilter && (
                    <div className="absolute left-0 top-10 w-full bg-white border-2 border-slate-200 rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <p className="text-sm text-slate-700">Radius: {radiusFilter} km</p>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={radiusFilter}
                          onChange={(e) => setRadiusFilter(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clear Filters */}
              {(statusFilter.length > 0 || sdgFilter.length > 0 || locationFilter) && (
                <div className="md:col-span-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Projects Table / Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border-2 border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
            </h3>
            <p className="text-slate-600 mb-6">
              {projects.length === 0
                ? 'Create your first CSR project to get started'
                : 'Try adjusting your filters or search query'
              }
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <button onClick={toggleAllRows}>
                          {selectedRows.length === filteredProjects.length ? (
                            <CheckSquare className="w-5 h-5 text-teal-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs text-slate-600 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-xs text-slate-600 uppercase tracking-wider">
                        SDGs
                      </th>
                      <th className="px-6 py-4 text-left text-xs text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs text-slate-600 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-left text-xs text-slate-600 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-4 text-right text-xs text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-200">
                    {displayedProjects.map(project => (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleViewProject(project)}
                      >
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleRowSelection(project.id)}>
                            {selectedRows.includes(project.id) ? (
                              <CheckSquare className="w-5 h-5 text-teal-600" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900 font-medium">{project.title}</p>
                          <p className="text-xs text-slate-500">{project.location.city}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {project.sdgs.slice(0, 3).map(sdgId => (
                              <span
                                key={sdgId}
                                className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                              >
                                {sdgId}
                              </span>
                            ))}
                            {project.sdgs.length > 3 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                +{project.sdgs.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full border-2 text-xs capitalize ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-700">
                            {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-slate-500">
                            to {new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900">
                            PKR {(project.budget / 1000).toFixed(0)}K
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenActionMenu(openActionMenu === project.id ? null : project.id)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-slate-600" />
                            </button>
                            
                            {openActionMenu === project.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenActionMenu(null)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-slate-200 py-2 z-20">
                                  <button
                                    onClick={() => {
                                      handleViewProject(project);
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleEditProject(project);
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDuplicateProject(project);
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Copy className="w-4 h-4" />
                                    Duplicate
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleShareProject(project);
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                  </button>
                                  <div className="border-t-2 border-slate-200 my-2" />
                                  <button
                                    onClick={() => {
                                      if (project.status === 'archived') {
                                        handleUnarchiveProject(project.id);
                                      } else {
                                        handleArchiveProject(project.id);
                                      }
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Archive className="w-4 h-4" />
                                    {project.status === 'archived' ? 'Unarchive' : 'Archive'}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden space-y-4">
              {displayedProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => handleViewProject(project)}
                  className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-slate-900 mb-1">{project.title}</h3>
                      <p className="text-xs text-slate-600">{project.location.city}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full border-2 text-xs capitalize ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.sdgs.map(sdgId => (
                      <span key={sdgId} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                        SDG {sdgId}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-slate-900">PKR {(project.budget / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {displayedProjects.length} of {filteredProjects.length} projects
              </p>
              {filteredProjects.length > pageSize && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    disabled={currentPage === 1}
                  >
                    <ChevronDown className="w-4 h-4 transform rotate-90" />
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {Math.ceil(filteredProjects.length / pageSize)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProjects.length / pageSize)))}
                    className="px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    disabled={currentPage === Math.ceil(filteredProjects.length / pageSize)}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedProject(null);
        }}
        onCreate={handleCreateProject}
        onSaveDraft={(draft) => {
          console.log('Draft saved:', draft);
        }}
        initialData={selectedProject || undefined}
      />

      {/* Project Detail Drawer */}
      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={showDetailDrawer}
        onClose={() => {
          setShowDetailDrawer(false);
          setSelectedProject(null);
        }}
      />

      {/* Share Project Modal */}
      <ShareProjectModal
        project={selectedProject}
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}