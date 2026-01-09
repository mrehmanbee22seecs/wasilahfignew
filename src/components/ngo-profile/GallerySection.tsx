import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface GallerySectionProps {
  images: {
    id: string;
    title: string;
    description: string;
  }[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8">
          Photo Gallery
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">No Photos Available</h3>
            <p className="text-slate-600">Gallery will be updated with project photos soon</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className="aspect-square bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 rounded-xl overflow-hidden cursor-pointer group relative border-2 border-slate-200 hover:border-blue-300 transition-all"
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm">{image.title}</p>
                  </div>
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">Click to view</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <ImageIcon className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">{images[selectedImage].title}</h3>
                <p className="text-slate-600">{images[selectedImage].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
