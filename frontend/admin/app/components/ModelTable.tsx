import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Typography,
  IconButton,
  Container,
} from "@mui/material";
import {Add as AddIcon, Edit as EditIcon} from "@mui/icons-material";
import React from "react";
import {useNavigate} from "@remix-run/react";

export const TableHeader = ({ title, route }: { title: string; route: string }) => {
  const navigate = useNavigate();

  return (
    <Stack
      justifyContent={"space-between"}
      sx={{ marginBottom: "2%" }}
      direction={"row"}
    >
      <Typography variant={"h4"} fontWeight={"800"}>
        {title}
      </Typography>
      <Button
        variant={"contained"}
        color={"primary"}
        sx={{ alignSelf: "flex-end" }}
        onClick={() => navigate(`/${route}/add`)}
        startIcon={<AddIcon />}
      >
        Добавить
      </Button>
    </Stack>
  );
};

export default function ZModelTable<T extends object>({
  columnTitles,
  columnKeys,
  data,
  onRequestEdit,
  showHeader,
  headerTitle,
  headerRoute,
}: {
  columnTitles: string[];
  columnKeys: string[];
  data: T[];
  onRequestEdit: (data: T) => void;
  showHeader?: boolean;
  headerTitle?: string;
  headerRoute?: string;
}) {
  return (
    <Container sx={{ width: "50vw" }}>
      <TableContainer>
        {showHeader && (
          <TableHeader route={headerRoute!} title={headerTitle!} />
        )}
        <Table sx={{backgroundColor: "#FFFFFF", borderRadius: "4px", p: 1}}>
          <TableHead>
            <TableRow>
              {columnTitles.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columnKeys.map((key) => (
                  <TableCell key={key}>{item[key] as string}</TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => onRequestEdit(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
