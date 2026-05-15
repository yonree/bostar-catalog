'use client';
import { useState } from 'react';
import type { ProductImage } from '@/types';

interface ProductGalleryProps {
  images: ProductImage[];
  mainImage?: string | null;
  productName: string;
}

export function ProductGallery({ images, mainImage, productName }: ProductGalleryProps) {
  const allImages = images.length > 0
    ? images.map((i) => i.url)
    : mainImage ? [mainImage] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-xl flex items-center justify-center">
        <svg className="w-20 h-20 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
        <img
          src={allImages[activeIndex]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-brand-500' : 'border-transparent'
              }`}
            >
              <img src={url} alt={`${productName} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
