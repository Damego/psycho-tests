import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface NotifyDialogMethods {
  open: () => void;
  close: () => void;
}

export interface NotifyDialogProps {
  title: string;
  children: string; // I don't think there should be ReactNode
}

const NotifyDialog = forwardRef<
  NotifyDialogMethods,
  NotifyDialogProps
>(({ title, children }, ref) => {
  const [isOpen, setOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [],
  );

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Понял</Button>
      </DialogActions>
    </Dialog>
  );
});

export default NotifyDialog;
