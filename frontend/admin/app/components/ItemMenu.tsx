import { IconButton, Stack } from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import React from "react";

export function ItemMenu({
  isEditing,
  onRequestEdit,
  onRequestDelete,
  onSubmit,
  onCancel,
}: {
  isEditing?: boolean;
  onRequestEdit: () => void;
  onRequestDelete: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <Stack direction={"row"}>
      {isEditing ? (
        <>
          <IconButton onClick={onSubmit}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={onRequestEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onRequestDelete}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
}
