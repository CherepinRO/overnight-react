import AuthDialog from '../AuthDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthDialogExample() {
  const [open, setOpen] = useState(true);
  
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Auth Dialog</Button>
      <AuthDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
