import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, RotateCw, ZoomIn, ZoomOut, Check, Image as ImageIcon, Loader } from 'lucide-react';

interface ProfilePhotoCropperProps {
  onImageCropped: (croppedImage: string) => void;
  currentImage?: string;
}

export function ProfilePhotoCropper({ onImageCropped, currentImage }: ProfilePhotoCropperProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const [showCropper, setShowCropper] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setShowCropper(true);
      // Reset crop settings
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleCrop = useCallback(async () => {
    if (!imagePreview || !canvasRef.current) return;

    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imagePreview;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to desired output (300x300 for profile photos)
      const outputSize = 300;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Clear canvas
      ctx.clearRect(0, 0, outputSize, outputSize);

      // Save context state
      ctx.save();

      // Apply transformations
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Calculate image dimensions to fill the circle while maintaining aspect ratio
      const imageAspect = img.width / img.height;
      let drawWidth, drawHeight;

      if (imageAspect > 1) {
        // Landscape
        drawHeight = outputSize / zoom;
        drawWidth = drawHeight * imageAspect;
      } else {
        // Portrait or square
        drawWidth = outputSize / zoom;
        drawHeight = drawWidth / imageAspect;
      }

      // Draw image centered with position offset
      ctx.drawImage(
        img,
        -drawWidth / 2 + position.x / zoom,
        -drawHeight / 2 + position.y / zoom,
        drawWidth,
        drawHeight
      );

      // Restore context
      ctx.restore();

      // Create circular mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Get cropped image as data URL
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      onImageCropped(croppedImage);
      setShowCropper(false);
      setImagePreview(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [imagePreview, zoom, rotation, position, onImageCropped]);

  const handleRemove = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setShowCropper(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile photo"
      />

      {/* Image Preview or Upload Button */}
      {!imagePreview ? (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-32 h-32 rounded-full border-2 border-dashed border-slate-300 hover:border-teal-600 transition-colors overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-teal-50 group-hover:to-blue-50 transition-colors flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-teal-600 transition-colors mb-2" />
              <span className="text-xs text-slate-600 group-hover:text-slate-900">Upload Photo</span>
            </div>
          </button>
          <p className="mt-3 text-xs text-slate-500 text-center">
            JPG, PNG or GIF • Max 5MB
          </p>
        </div>
      ) : !showCropper ? (
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowCropper(true)}
            className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Edit photo
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Cropping Interface */}
          <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-white mb-4">
              <h4 className="font-medium flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Adjust Your Photo
              </h4>
              <button
                type="button"
                onClick={() => setShowCropper(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close cropper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative bg-slate-800 rounded-xl overflow-hidden">
              <div
                className="relative w-full aspect-square flex items-center justify-center cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  touchAction: 'none',
                }}
              >
                {imagePreview && (
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-w-full max-h-full select-none pointer-events-none"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                    draggable={false}
                  />
                )}

                {/* Circular Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <mask id="circleMask">
                      <rect width="100" height="100" fill="white" />
                      <circle cx="50" cy="50" r="35" fill="black" />
                    </mask>
                  </defs>
                  <rect
                    width="100"
                    height="100"
                    fill="rgba(0, 0, 0, 0.5)"
                    mask="url(#circleMask)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              {/* Zoom Control */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Zoom</span>
                  <span className="text-white">{Math.round(zoom * 100)}%</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-white"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rotate Button */}
              <button
                type="button"
                onClick={handleRotate}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Rotate 90°
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCropper(false)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCrop}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Apply
                  </>
                )}
              </button>
            </div>

            {/* Tip */}
            <p className="text-xs text-slate-400 text-center">
              Drag to reposition • Scroll or use slider to zoom
            </p>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />

      {/* CSS for range slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, rgb(13, 148, 136), rgb(37, 99, 235));
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, rgb(13, 148, 136), rgb(37, 99, 235));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
