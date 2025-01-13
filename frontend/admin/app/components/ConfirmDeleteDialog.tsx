import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

export default function ConfirmDeleteDialog({
  text,
  isOpen,
  onClose,
  onDelete,
}: {
  text: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onDelete}>Удалить</Button>
      </DialogActions>
    </Dialog>
  );
}
