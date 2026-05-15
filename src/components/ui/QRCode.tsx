'use client';
import { useState, useEffect } from 'react';

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export function QRCode({ url, size = 200, className }: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    import('qrcode').then((QRCode) => {
      if (cancelled) return;
      QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then((result: string) => {
        if (!cancelled) setDataUrl(result);
      });
    });
    return () => { cancelled = true; };
  }, [url, size]);

  if (!dataUrl) {
    return <div style={{ width: size, height: size }} className={`bg-neutral-100 animate-pulse rounded ${className || ''}`} />;
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={className}
    />
  );
}

export async function downloadQRCode(url: string, filename: string) {
  const QRCode = await import('qrcode');
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, url, { width: 300, margin: 2 });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}
