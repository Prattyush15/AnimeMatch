"use client";
import * as React from 'react';
import { ToastProvider } from '@/components/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}


