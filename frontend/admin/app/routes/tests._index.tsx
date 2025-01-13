import { json, MetaFunction } from "@remix-run/node";
import React from "react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { apiService } from "../../api/apiService";
import { ITest } from "../../api/types/tests";
import { Button, Stack, Typography } from "@mui/material";

export const meta: MetaFunction = () => {
  return [{ title: "Тесты" }];
};

export async function loader() {
  const res = await apiService.getTestList();
  return json(res.data);
}

const TestItem = ({ test }: { test: ITest }) => {
  return (
    <Link
      to={`/tests/${test.id!}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Stack sx={{ backgroundColor: "#FFFFFF", borderRadius: "4px", p: 1 }}>
        <Typography variant={"h5"} fontWeight={"500"}>
          {test.name}
        </Typography>
        <Typography>{test.questions.length} вопросов</Typography>
      </Stack>
    </Link>
  );
};

export default function TestsIndexRoute() {
  const tests = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} gap={8} mb={2}>
        <Typography variant={"h4"} fontWeight={"800"}>
          Психологические тесты
        </Typography>
        <Button onClick={() => navigate("/tests/add")} variant={"contained"}>
          Добавить тест
        </Button>
      </Stack>
      <Stack gap={2}>
        {tests.map((test) => (
          <TestItem key={test.id!} test={test} />
        ))}
      </Stack>
    </>
  );
}
