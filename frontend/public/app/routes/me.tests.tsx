import { httpClient } from "~/api/http";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Stack, Typography } from "@mui/material";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const res = await httpClient.getUserCompletedTests()(request);
  return json(res.data);
}

export default function UserTestsRoute() {
  const results = useLoaderData<typeof loader>();

  return (
    <Stack>
      <Typography fontSize={30} color={"#496CC6"} mb={2}>
        Пройденные психологические тесты
      </Typography>
      {!results.length && (
        <Typography variant={"h6"}>Вы ещё не прошли не один тест</Typography>
      )}
      <Stack gap={1}>
        {results.map((result) => (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            sx={{
              padding: 2,
              boxShadow: "0px 0px 7px #638EFF",
              borderRadius: "4px",
            }}
          >
            <Stack>
              <Typography fontSize={20} fontWeight={"500"}>
                {result.test!.name}
              </Typography>
              <Typography sx={{ mt: 2 }}>{result.content}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
