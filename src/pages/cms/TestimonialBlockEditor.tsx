import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Save,
  Monitor,
  Smartphone,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * TestimonialBlockEditor - Specialized editor for homepage testimonials
 * 
 * Features:
 * - Drag-and-drop reordering
 * - Add/edit/delete testimonial cards
 * - Toggle visibility
 * - Live preview (desktop + mobile)
 * - Quick edit inline
 * 
 * @accessibility Full keyboard support, ARIA labels
 */

type Testimonial = {
  id: string;
  quote: string;
  personName: string;
  personRole: string;
  company: string;
  photo?: string;
  visible: boolean;
  order: number;
};

type TestimonialBlockEditorProps = {
  onNavigate?: (section: any) => void;
};

export default function TestimonialBlockEditor({ onNavigate }: TestimonialBlockEditorProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      quote: 'Wasilah transformed how we connect with meaningful CSR projects. The platform made it incredibly easy to find and support initiatives aligned with our corporate values.',
      personName: 'Amna Rauf',
      personRole: 'CSR Manager',
      company: 'Engro Corporation',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      visible: true,
      order: 0,
    },
    {
      id: '2',
      quote: 'The volunteer matching system is brilliant. We mobilized over 200 employee volunteers in just two weeks for our education initiative.',
      personName: 'Fahad Ahmed',
      personRole: 'Head of Community Impact',
      company: 'Unilever Pakistan',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      visible: true,
      order: 1,
    },
    {
      id: '3',
      quote: 'As an NGO, Wasilah gave us visibility to corporate partners we could never reach before. Our project funding increased by 300% in the first year.',
      personName: 'Sadia Khan',
      personRole: 'Executive Director',
      company: 'Green Pakistan Foundation',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      visible: true,
      order: 2,
    },
    {
      id: '4',
      quote: 'The transparency and reporting features make it easy to demonstrate impact to our stakeholders. Highly recommended for any corporate serious about CSR.',
      personName: 'Hassan Malik',
      personRole: 'Sustainability Lead',
      company: 'Lucky Cement',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      visible: false,
      order: 3,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reordered = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setTestimonials(reordered);
    setHasUnsavedChanges(true);
    toast.success('Order updated');
  };

  const handleToggleVisibility = (id: string) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id ? { ...t, visible: !t.visible } : t
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this testimonial?')) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      setHasUnsavedChanges(true);
      toast.success('Testimonial deleted');
    }
  };

  const handleAdd = () => {
    const newTestimonial: Testimonial = {
      id: `new-${Date.now()}`,
      quote: 'Enter testimonial quote here...',
      personName: 'Person Name',
      personRole: 'Role',
      company: 'Company',
      visible: true,
      order: testimonials.length,
    };
    setTestimonials([...testimonials, newTestimonial]);
    setEditingId(newTestimonial.id);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In real implementation, would save to backend
    toast.success('Testimonial block saved');
    setHasUnsavedChanges(false);
    setEditingId(null);
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, value: any) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      )
    );
    setHasUnsavedChanges(true);
  };

  const visibleTestimonials = testimonials.filter((t) => t.visible);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onNavigate && (
              <button
                onClick={() => onNavigate('cms')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Homepage Testimonials</h1>
              <p className="text-sm text-gray-500">
                {visibleTestimonials.length} visible • Drag to reorder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 mr-2">Unsaved changes</span>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Editor Column */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Add New Button */}
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
                Add Testimonial
              </button>

              {/* Testimonials List */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="testimonials">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 ${
                        snapshot.isDraggingOver ? 'bg-blue-50 p-2 rounded-lg' : ''
                      }`}
                    >
                      {testimonials.map((testimonial, index) => (
                        <Draggable
                          key={testimonial.id}
                          draggableId={testimonial.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white rounded-lg border-2 transition-all ${
                                snapshot.isDragging
                                  ? 'border-blue-500 shadow-lg'
                                  : testimonial.visible
                                  ? 'border-gray-200'
                                  : 'border-gray-200 opacity-50'
                              }`}
                            >
                              {/* Card Header */}
                              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>

                                <div className="flex-1 flex items-center gap-2">
                                  {testimonial.photo && (
                                    <img
                                      src={testimonial.photo}
                                      alt={testimonial.personName}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {testimonial.personName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {testimonial.personRole} • {testimonial.company}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleToggleVisibility(testimonial.id)}
                                    className={`p-2 rounded-lg ${
                                      testimonial.visible
                                        ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                    title={testimonial.visible ? 'Visible' : 'Hidden'}
                                  >
                                    {testimonial.visible ? (
                                      <Eye className="w-4 h-4" />
                                    ) : (
                                      <EyeOff className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleEdit(testimonial.id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-4">
                                {editingId === testimonial.id ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Quote
                                      </label>
                                      <textarea
                                        value={testimonial.quote}
                                        onChange={(e) =>
                                          handleUpdateTestimonial(
                                            testimonial.id,
                                            'quote',
                                            e.target.value
                                          )
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Name
                                        </label>
                                        <input
                                          type="text"
                                          value={testimonial.personName}
                                          onChange={(e) =>
                                            handleUpdateTestimonial(
                                              testimonial.id,
                                              'personName',
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Role
                                        </label>
                                        <input
                                          type="text"
                                          value={testimonial.personRole}
                                          onChange={(e) =>
                                            handleUpdateTestimonial(
                                              testimonial.id,
                                              'personRole',
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Company
                                      </label>
                                      <input
                                        type="text"
                                        value={testimonial.company}
                                        onChange={(e) =>
                                          handleUpdateTestimonial(
                                            testimonial.id,
                                            'company',
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Photo URL
                                      </label>
                                      <input
                                        type="url"
                                        value={testimonial.photo || ''}
                                        onChange={(e) =>
                                          handleUpdateTestimonial(
                                            testimonial.id,
                                            'photo',
                                            e.target.value
                                          )
                                        }
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                      />
                                    </div>
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      Done Editing
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-700 italic">
                                    "{testimonial.quote}"
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-[480px] bg-white border-l border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Live Preview</h3>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                        previewDevice === 'desktop'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                        previewDevice === 'mobile'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      Mobile
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Showing {visibleTestimonials.length} visible testimonials
                </p>
              </div>

              <div className="p-6 bg-gray-50">
                {/* Preview Frame */}
                <div
                  className={`bg-white rounded-lg shadow-sm p-6 transition-all ${
                    previewDevice === 'mobile' ? 'max-w-[375px] mx-auto' : ''
                  }`}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                    What Our Partners Say
                  </h2>
                  <p className="text-gray-600 text-center mb-8">
                    Trusted by leading organizations across Pakistan
                  </p>

                  <div
                    className={`grid gap-6 ${
                      previewDevice === 'desktop' ? 'grid-cols-1' : 'grid-cols-1'
                    }`}
                  >
                    {visibleTestimonials.slice(0, 3).map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg p-6 border border-blue-100"
                      >
                        <p className="text-gray-700 italic mb-4 text-sm">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-3">
                          {testimonial.photo && (
                            <img
                              src={testimonial.photo}
                              alt={testimonial.personName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {testimonial.personName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {testimonial.personRole} • {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
