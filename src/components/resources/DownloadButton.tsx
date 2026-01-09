import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DownloadButton({ 
  fileUrl, 
  fileName, 
  variant = 'primary',
  className = '',
  size = 'md'
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, this would trigger actual file download
    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.download = fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    
    console.log('Downloading:', fileUrl, fileName);
    setDownloading(false);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:shadow-lg',
    secondary: 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-medium transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      aria-label={downloading ? 'Preparing download...' : `Download ${fileName}`}
    >
      {downloading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span>Preparing download...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download {variant === 'primary' ? 'PDF' : ''}</span>
        </>
      )}
    </button>
  );
}
