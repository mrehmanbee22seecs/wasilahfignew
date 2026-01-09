import React, { useState } from 'react';
import { DocumentUploader } from '../DocumentUploader';
import { DocumentChecklist } from '../DocumentChecklist';
import { DocumentRow } from '../DocumentRow';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';
import { DocumentMetadataModal } from '../modals/DocumentMetadataModal';
import type { NGODocument, DocumentChecklistItem } from '../../../types/ngo';
import { DOCUMENT_CHECKLIST } from '../../../data/mockNGOData';
import { toast } from 'sonner';

interface DocumentsTabProps {
  ngoId: string;
  documents: NGODocument[];
  onUploadComplete?: (doc: NGODocument) => void;
  highlightMissing?: boolean;
}

export function DocumentsTab({ ngoId, documents, onUploadComplete, highlightMissing = false }: DocumentsTabProps) {
  const [previewDocument, setPreviewDocument] = useState<NGODocument | null>(null);
  const [editingDocument, setEditingDocument] = useState<NGODocument | null>(null);
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>(DOCUMENT_CHECKLIST);
  const [localDocuments, setLocalDocuments] = useState<NGODocument[]>(documents);
  const [shouldHighlight, setShouldHighlight] = useState(highlightMissing);

  // Auto-update checklist when documents change
  React.useEffect(() => {
    const updatedChecklist = DOCUMENT_CHECKLIST.map(item => {
      const relatedDocs = localDocuments.filter(doc => doc.type === item.type);
      
      if (relatedDocs.length > 0) {
        // Get the most recent document status
        const latestDoc = relatedDocs.sort((a, b) => 
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        )[0];
        
        // Check if document is expired
        if (latestDoc.expiry_date && new Date(latestDoc.expiry_date) < new Date()) {
          return { ...item, status: 'expired' as const, documents: relatedDocs };
        }
        
        // Return document status
        return { 
          ...item, 
          status: latestDoc.status === 'uploaded' ? 'uploaded' as const :
                  latestDoc.status === 'under_review' ? 'under_review' as const :
                  latestDoc.status === 'accepted' ? 'accepted' as const :
                  latestDoc.status === 'rejected' ? 'missing' as const :
                  'uploaded' as const,
          documents: relatedDocs 
        };
      }
      
      return { ...item, status: 'missing' as const };
    });
    
    setChecklist(updatedChecklist);
  }, [localDocuments]);

  // Reset highlight after 3 seconds
  React.useEffect(() => {
    if (highlightMissing) {
      setShouldHighlight(true);
      const timer = setTimeout(() => setShouldHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightMissing]);

  const handlePreview = (doc: NGODocument) => {
    setPreviewDocument(doc);
  };

  const handleDownload = (doc: NGODocument) => {
    console.log('Download document:', doc.id);
    // Simulate download
    const link = document.createElement('a');
    link.href = doc.thumbnail_url || '#';
    link.download = doc.filename;
    link.click();
    toast.success(`Downloading ${doc.filename}`);
  };

  const handleDelete = (doc: NGODocument) => {
    if (confirm(`Are you sure you want to delete "${doc.filename}"?`)) {
      setLocalDocuments(prev => prev.filter(d => d.id !== doc.id));
      toast.success('Document deleted successfully');
    }
  };

  const handleReplace = (doc: NGODocument) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/jpeg,image/png,video/mp4';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate replace
        toast.success(`Replacing ${doc.filename} with ${file.name}`);
        setLocalDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? { ...d, filename: file.name, size: file.size, uploaded_at: new Date().toISOString() }
            : d
        ));
      }
    };
    input.click();
  };

  const handleEditMetadata = (doc: NGODocument) => {
    setEditingDocument(doc);
  };

  const handleSaveMetadata = (updatedDoc: NGODocument) => {
    setLocalDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    setEditingDocument(null);
    toast.success('Metadata updated successfully');
  };

  return (
    <div className="space-y-8" id="documents-section">
      {/* Document Checklist */}
      <div>
        <DocumentChecklist 
          items={checklist}
          onItemClick={(item) => {
            // Scroll to document list or open uploader
            console.log('Checklist item clicked:', item);
          }}
          highlightMissing={shouldHighlight}
        />
      </div>

      {/* Document Uploader */}
      <div>
        <h2 className="text-slate-900 mb-4">Upload Documents</h2>
        <DocumentUploader
          ngoId={ngoId}
          onUploadComplete={onUploadComplete}
          onUploadError={(error) => {
            console.error('Upload error:', error);
          }}
        />
      </div>

      {/* Uploaded Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900">Uploaded Documents</h2>
          <span className="text-sm text-slate-600">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map(doc => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onReplace={handleReplace}
                onEditMetadata={handleEditMetadata}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-sm text-slate-600">No documents uploaded yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload documents using the form above
            </p>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewDocument !== null}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
      />

      {/* Document Metadata Modal */}
      <DocumentMetadataModal
        isOpen={editingDocument !== null}
        onClose={() => setEditingDocument(null)}
        document={editingDocument}
        onSave={handleSaveMetadata}
      />
    </div>
  );
}