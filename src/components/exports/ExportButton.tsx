import React, { useState } from 'react';
import { FileDown, History } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ExportHistoryPanel } from './ExportHistoryPanel';
import { ExportEntityType } from './types';
import { useExports } from '../../hooks/useExports';

type ExportButtonProps = {
  entityType?: ExportEntityType;
  variant?: 'primary' | 'secondary';
  showHistory?: boolean;
};

/**
 * Reusable Export Button with Modal
 * Can be placed anywhere in the admin dashboard
 */
export function ExportButton({
  entityType = 'projects',
  variant = 'secondary',
  showHistory = true,
}: ExportButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const {
    exportHistory,
    isExporting,
    createExport,
    deleteExport,
    clearHistory,
    redownloadExport,
  } = useExports();

  const handleExport = async (config: any) => {
    await createExport(config);
  };

  const buttonClasses =
    variant === 'primary'
      ? 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2'
      : 'px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2';

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setModalOpen(true)} className={buttonClasses}>
          <FileDown className="w-4 h-4" />
          Export
        </button>

        {showHistory && exportHistory.length > 0 && (
          <button
            onClick={() => setHistoryOpen(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 relative"
          >
            <History className="w-4 h-4" />
            History
            {exportHistory.filter((e) => e.status === 'completed').length >
              0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {exportHistory.filter((e) => e.status === 'completed').length}
              </span>
            )}
          </button>
        )}
      </div>

      <ExportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onExport={handleExport}
        defaultEntityType={entityType}
      />

      <ExportHistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        exports={exportHistory}
        onRedownload={redownloadExport}
        onDelete={deleteExport}
        onClearAll={clearHistory}
      />
    </>
  );
}
