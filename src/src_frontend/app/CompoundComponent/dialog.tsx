// Import necessary modules
"use client";
import { Button } from "@/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/ui/dialog";
import * as React from "react";


type ReusableDialogProps = {
  triggerText: string;
  dialogTitle: string;
  dialogDescription?: string;
  children: React.ReactNode; // Content inside the dialog (e.g., forms, components, etc.)
  triggerVariant?: string; // Optional for customizing button styles
};

export const ReusableDialog: React.FC<ReusableDialogProps> = ({
  triggerText,
  dialogTitle,
  dialogDescription,
  children,
}) => {
  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant={`outline`}>{triggerText}</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[425px]">
        {/* Title */}
        <DialogTitle>{dialogTitle}</DialogTitle>

        {/* Optional Description */}
        {dialogDescription && (
          <DialogDescription>{dialogDescription}</DialogDescription>
        )}

        {/* Custom Content */}
        {children}

        {/* Close Button Example (Optional) */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export default for ease of use
export default ReusableDialog;
