'use client';
import { useState } from 'react';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { ProductCTA } from '@/components/product/ProductCTA';
import { useTracking } from '@/hooks/useTracking';
import { useEffect } from 'react';

interface ProductDetailClientProps {
  productId: string;
  productName: string;
}

export function ProductDetailClient({ productId, productName }: ProductDetailClientProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { trackProductView } = useTracking();

  useEffect(() => {
    trackProductView(productId);
  }, [productId, trackProductView]);

  return (
    <>
      <ProductCTA onInquiry={() => setInquiryOpen(true)} />
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
