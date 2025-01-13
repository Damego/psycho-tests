import { IconButton, Stack, TextField } from "@mui/material";
import { ITestResult } from "../../../api/types/tests";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function TestResult({
  maxPoints,
  result,
  onUpdate,
  onDelete,
}: {
  maxPoints: number;
  result: ITestResult;
  onUpdate: (result: ITestResult) => void;
  onDelete: () => void;
}) {
  const handlePointsUpdate = (
    field: "min_points" | "max_points",
    value: number,
  ) => {
    let newValue = value;
    if (newValue < 0) newValue = 0;
    else if (newValue > maxPoints) newValue = maxPoints;

    const res = { ...result, [field]: newValue };
    onUpdate(res);
  };

  const onContentUpdate = (value: string) => {
    const res = { ...result, content: value } as ITestResult;
    onUpdate(res);
  };

  return (
    <Stack gap={2}>
      <Stack direction={"row"}>
        <TextField
          label={"От"}
          type={"number"}
          value={result.min_points}
          onChange={(event) =>
            handlePointsUpdate("min_points", Number.parseInt(event.target.value))
          }
        />
        <TextField
          label={"До (включая)"}
          type={"number"}
          value={result.max_points}
          onChange={(event) =>
            handlePointsUpdate("max_points", Number.parseInt(event.target.value))
          }
        />
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Stack>
      <TextField
        label={"Сообщение"}
        multiline
        fullWidth
        value={result.content}
        onChange={(event) => onContentUpdate(event.target.value)}
      />
    </Stack>
  );
}
