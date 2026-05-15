'use client';
import { Modal } from '@/components/ui/Modal';
import { InquiryForm } from './InquiryForm';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  productName?: string;
  salespersonId?: string;
}

export function InquiryModal({ open, onClose, productId, productName, salespersonId }: InquiryModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="在线询盘" size="md">
      <InquiryForm
        productId={productId}
        productName={productName}
        salespersonId={salespersonId}
        onSuccess={() => setTimeout(onClose, 2000)}
      />
    </Modal>
  );
}
