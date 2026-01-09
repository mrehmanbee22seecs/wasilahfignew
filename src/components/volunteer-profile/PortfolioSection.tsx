import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface PortfolioSectionProps {
  items: PortfolioItem[];
}

export function PortfolioSection({ items }: PortfolioSectionProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8">Portfolio & Contributions</h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(index)}
              className="aspect-square bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 rounded-xl overflow-hidden cursor-pointer group relative border-2 border-slate-200 hover:border-blue-400 transition-all hover:shadow-xl"
            >
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs line-clamp-2">{item.title}</p>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <span className="text-white text-xs bg-blue-600 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <ImageIcon className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">{items[selectedItem].title}</h3>
                <p className="text-slate-600 mb-3">{items[selectedItem].description}</p>
                <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                  {items[selectedItem].category}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
