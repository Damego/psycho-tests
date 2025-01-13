import useAsyncFetcher from "~/hooks/useAsyncFetcher";
import { IApiResponse } from "~/api/http";
import { Form, useOutletContext } from "@remix-run/react";
import { IUser } from "~/api/types/users";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import React from "react";
import { Box, Button, InputLabel, Stack, Typography } from "@mui/material";
import StyledInput from "~/components/StyledInput";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required("Имя пользователя обязательно к заполнению"),
});

export default function UserPersonalSection() {
  const fetcher = useAsyncFetcher<IApiResponse<null>>();
  const { user } = useOutletContext<{ user: IUser }>();

  const formik = useFormik<{ name: string }>({
    initialValues: {
      name: user.name,
    },
    onSubmit: async ({ name }: { name: string }) => {
      if (name === user.name) return;

      const res = await fetcher.submit(
        {
          id: user.id,
          name,
        },
        { method: "POST", encType: "application/json" },
      );

      if (res!.error) {
        toast.error(res!.error.message);
      } else {
        toast.success("Новое имя пользователя сохранено!");
      }
    },
    validationSchema,
  });

  return (
    <React.Fragment>
      <Typography fontSize={30} color={"#496CC6"} mb={2}>
        Личная информация
      </Typography>
      <Form
        onSubmit={formik.handleSubmit}
        method={"POST"}
        style={{ display: "flex", flex: 1, flexDirection: "column" }}
      >
        <Stack direction={"row"} gap={2}>
          <Stack>
            <InputLabel shrink htmlFor="id">
              <Typography fontWeight={"600"} fontSize={18}>
                Имя пользователя
              </Typography>
            </InputLabel>
            <StyledInput
              required
              id="name"
              name="name"
              placeholder={"Имя пользователя"}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Stack>
          {formik.values.name !== user.name && (
            <Box sx={{ marginTop: "auto", alignSelf: "center" }}>
              <Button
                type={"submit"}
                sx={{
                  fontSize: 14,
                  borderRadius: "4px",
                  boxShadow: "0px 0px 7px #638EFF",
                  width: "fit-content",
                  padding: "12px 16px 12px 16px",
                }}
              >
                Сохранить
              </Button>
            </Box>
          )}
        </Stack>
      </Form>
    </React.Fragment>
  );
}
