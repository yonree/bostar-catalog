'use client';
import { Button } from '@/components/ui/Button';

interface ProductCTAProps {
  onInquiry: () => void;
  phone?: string;
  whatsapp?: string;
}

export function ProductCTA({ onInquiry, phone, whatsapp }: ProductCTAProps) {
  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 z-20 md:static md:border-none md:bg-transparent md:px-0 md:py-0">
      <div className="flex gap-2 max-w-lg mx-auto md:mx-0">
        <Button onClick={onInquiry} className="flex-1" size="lg">
          在线询盘
        </Button>
        {phone && (
          <a href={`tel:${phone}`} className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              一键拨号
            </Button>
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full" size="lg">
              WhatsApp
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
