import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });
}

export function getExclusiveUrl(base: string, salespersonSlug: string): string {
  return `${base}/r/${salespersonSlug}`;
}
