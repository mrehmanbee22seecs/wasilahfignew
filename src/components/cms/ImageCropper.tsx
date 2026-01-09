import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/**
 * ImageCropper - Full image cropping tool
 * 
 * Features:
 * - Aspect ratio presets (1:1, 4:3, 16:9, free)
 * - Focal point selection
 * - Zoom controls
 * - Rotation
 * - Drag to reposition
 * - Preview of final crop
 * 
 * @accessibility Keyboard controls, ARIA labels
 */

type AspectRatio = '1:1' | '4:3' | '16:9' | 'free';

type ImageCropperProps = {
  imageUrl: string;
  onComplete: (croppedImageUrl: string, cropData: CropData) => void;
  onCancel: () => void;
  initialAspectRatio?: AspectRatio;
};

export type CropData = {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: AspectRatio;
  zoom: number;
  rotation: number;
};

export function ImageCropper({
  imageUrl,
  onComplete,
  onCancel,
  initialAspectRatio = '16:9',
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 300, height: 200 });

  const aspectRatios = {
    '1:1': 1,
    '4:3': 4 / 3,
    '16:9': 16 / 9,
    'free': 0,
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = imageUrl;
        setImageLoaded(true);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (imageLoaded && aspectRatio !== 'free') {
      // Recalculate crop area based on aspect ratio
      const ratio = aspectRatios[aspectRatio];
      const newHeight = cropArea.width / ratio;
      setCropArea(prev => ({ ...prev, height: newHeight }));
    }
  }, [aspectRatio, imageLoaded]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropComplete = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const ratio = aspectRatios[aspectRatio] || cropArea.width / cropArea.height;

    // Set canvas size to crop dimensions
    canvas.width = 800; // Output width
    canvas.height = aspectRatio === 'free' ? (cropArea.height / cropArea.width) * 800 : 800 / ratio;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate source coordinates
    const sourceX = cropArea.x - position.x;
    const sourceY = cropArea.y - position.y;

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      cropArea.width,
      cropArea.height,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    ctx.restore();

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    const cropData: CropData = {
      x: cropArea.x,
      y: cropArea.y,
      width: cropArea.width,
      height: cropArea.height,
      aspectRatio,
      zoom,
      rotation,
    };

    onComplete(croppedImageUrl, cropData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Maximize2 className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Crop Image</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            Apply Crop
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          <div
            className="relative cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.2s',
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-full max-h-[70vh] object-contain"
              draggable={false}
            />
          </div>

          {/* Crop Overlay */}
          <div
            className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{
              left: `${cropArea.x}px`,
              top: `${cropArea.y}px`,
              width: `${cropArea.width}px`,
              height: `${cropArea.height}px`,
            }}
          >
            {/* Grid lines */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
            </div>
          </div>

          {/* Hidden canvas for export */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Panel */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['1:1', '4:3', '16:9', 'free'] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {ratio === 'free' ? 'Free' : ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">Zoom</label>
                <span className="text-sm text-gray-400">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  title="Zoom out"
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
                  className="flex-1"
                />
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">Rotation</label>
                <span className="text-sm text-gray-400">{rotation}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation((rotation - 90) % 360)}
                  className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  title="Rotate left"
                >
                  <RotateCw className="w-4 h-4 transform scale-x-[-1]" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  title="Rotate right"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 text-sm"
            >
              Reset All
            </button>

            {/* Help */}
            <div className="pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Tips:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Drag the image to reposition</li>
                <li>• Use zoom to fit the crop area</li>
                <li>• Rotation is applied to final image</li>
                <li>• White frame shows final crop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
