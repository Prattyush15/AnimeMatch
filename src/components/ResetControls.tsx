"use client";
import { Button } from '@/components/ui';
import { resetAll } from '@/lib/storage';

export default function ResetControls() {
  const fullReset = () => {
    resetAll();
    // Reload to ensure all client state re-initializes (quiz, deck, pages)
    if (typeof window !== 'undefined') window.location.reload();
  };
  return (
    <div className="mt-4">
      <Button variant="outline" onClick={fullReset} aria-label="Full reset">
        Full Reset
      </Button>
    </div>
  );
}


