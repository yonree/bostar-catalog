'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

type ProductImageProps = {
  alt: string;
  candidates: string[];
  className?: string;
};

export function ProductImage({ alt, candidates, className }: ProductImageProps) {
  const sources = useMemo(
    () => candidates.filter((value, index, arr) => value && arr.indexOf(value) === index),
    [candidates]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const src = sources[activeIndex] || '/images/product-gun-render.png';

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => {
        setActiveIndex((current) => (current < sources.length - 1 ? current + 1 : current));
      }}
      unoptimized
    />
  );
}
