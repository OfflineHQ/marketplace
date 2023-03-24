'use client';

import { useToast } from './useToast';
import { ToastProps, ToastActionElement } from './Toast';

import { Button } from '../button/Button';

export type ToasterToast = ToastProps & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export function ToastSimple(args: ToasterToast) {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast(args);
      }}
    >
      Show Toast
    </Button>
  );
}
