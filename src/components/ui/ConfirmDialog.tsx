import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-50' : 'bg-brand-50'}`}>
          <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-500' : 'text-brand-500'}`} />
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
