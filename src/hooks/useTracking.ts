'use client';
import { useCallback, useEffect, useRef } from 'react';

function getVisitorId(): string {
  if (typeof document === 'undefined') return '';
  let id = document.cookie
    .split('; ')
    .find((r) => r.startsWith('bostar_visitor='))
    ?.split('=')[1];
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
    document.cookie = `bostar_visitor=${id}; path=/; max-age=${30 * 24 * 60 * 60}`;
  }
  return id;
}

function getSalespersonSlug(): string | null {
  if (typeof document === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find((r) => r.startsWith('bostar_ref='))
    ?.split('=')[1] || null;
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function useTracking() {
  const visitorId = useRef('');
  const sessionId = useRef('');

  useEffect(() => {
    visitorId.current = getVisitorId();
    sessionId.current = generateSessionId();
  }, []);

  const track = useCallback(
    async (
      eventType: string,
      data: {
        pageUrl?: string;
        pageTitle?: string;
        productId?: string;
        documentId?: string;
        videoId?: string;
        keyword?: string;
        duration?: number;
        metadata?: Record<string, unknown>;
      } = {}
    ) => {
      try {
        const payload = {
          visitorId: visitorId.current || getVisitorId(),
          sessionId: sessionId.current || generateSessionId(),
          salespersonId: getSalespersonSlug(),
          eventType,
          pageUrl: data.pageUrl || (typeof window !== 'undefined' ? window.location.pathname : ''),
          pageTitle: data.pageTitle || (typeof document !== 'undefined' ? document.title : ''),
          productId: data.productId,
          documentId: data.documentId,
          videoId: data.videoId,
          keyword: data.keyword,
          duration: data.duration,
          metadata: data.metadata,
        };

        if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
          navigator.sendBeacon(
            '/api/events',
            JSON.stringify(payload)
          );
        } else {
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          });
        }
      } catch {
        // Tracking failure should never block UX
      }
    },
    []
  );

  const trackPageView = useCallback(
    (pageUrl?: string, pageTitle?: string) => track('page_view', { pageUrl, pageTitle }),
    [track]
  );

  const trackProductView = useCallback(
    (productId: string) => track('product_view', { productId }),
    [track]
  );

  const trackCategoryView = useCallback(
    () => track('category_view', {}),
    [track]
  );

  const trackSearch = useCallback(
    (keyword: string) => track('search', { keyword }),
    [track]
  );

  const trackPhoneClick = useCallback(() => track('phone_click', {}), [track]);
  const trackWechatClick = useCallback(() => track('wechat_click', {}), [track]);
  const trackWhatsappClick = useCallback(() => track('whatsapp_click', {}), [track]);

  const trackDocumentDownload = useCallback(
    (documentId: string) => track('document_download', { documentId }),
    [track]
  );

  const trackVideoPlay = useCallback(
    (videoId: string) => track('video_play', { videoId }),
    [track]
  );

  const trackVideoProgress = useCallback(
    (videoId: string, duration: number) => track('video_progress', { videoId, duration }),
    [track]
  );

  const trackInquirySubmit = useCallback(
    (productId?: string) => track('inquiry_submit', { productId }),
    [track]
  );

  return {
    track,
    trackPageView,
    trackProductView,
    trackCategoryView,
    trackSearch,
    trackPhoneClick,
    trackWechatClick,
    trackWhatsappClick,
    trackDocumentDownload,
    trackVideoPlay,
    trackVideoProgress,
    trackInquirySubmit,
  };
}
