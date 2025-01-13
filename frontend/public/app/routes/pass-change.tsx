import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Box, Typography, Button } from "@mui/material";
import { Form, useLoaderData } from "@remix-run/react";
import { redirect } from "react-router";
import { useFormik } from "formik";
import StyledInput from "~/components/StyledInput";
import * as yup from "yup";
import { httpClient, IApiError } from "~/api/http";
import useAsyncFetcher from "~/hooks/useAsyncFetcher";
import { toast } from "react-toastify";
import { ErrorResponseCodes } from "~/api/types/enums";

interface IChangePasswordPayload {
  password: string;
  token: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Регистрация | Стобой" },
    { name: "description", content: "Добро пожаловать на сайт Стобой!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    throw redirect("/");
  }
  return token;
}

export async function action({ request }: ActionFunctionArgs) {
  const { password, token }: IChangePasswordPayload = await request.json();

  const res = await httpClient.changePassword(token, password)(request);

  if (res.error) {
    return res.error;
  }

  return redirect(`/login`);
}

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Длина пароля должна быть как минимум из 8 символов")
    .required("Пароль обязателен к заполнению"),
});

export default function RegisterRoute() {
  const token = useLoaderData<typeof loader>();
  const fetcher = useAsyncFetcher<IApiError>();

  const formik = useFormik<Omit<IChangePasswordPayload, "token">>({
    initialValues: {
      password: "",
    },
    validationSchema,
    onSubmit: async ({ password }) => {
      const error = await fetcher.submit(
        { password, token },
        { method: "POST", encType: "application/json" },
      );

      if (!error) return toast.success("Пароль успешно сменён!");

      if (error.code === ErrorResponseCodes.TOKEN_EXPIRED) {
        toast.error("Ссылка устарела. Сбросьте пароль ещё раз");
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        p: 3,
        borderRadius: "4px",
        boxShadow: "0px 0px 7px #638EFF",
        height: "fit-content",
        gap: 1,
      }}
    >
      <Typography component="h5" variant="h5" color={"#496CC6"} fontSize={30}>
        Смена пароля
      </Typography>

      <Typography color={"#FF7272"} fontSize={18}>
        {formik.touched.password && formik.errors.password}
      </Typography>

      <Form
        onSubmit={formik.handleSubmit}
        method="POST"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <StyledInput
          fullWidth
          name="password"
          type="password"
          id="password"
          autoComplete={"new-password"}
          placeholder="Пароль"
          value={formik.values.password}
          onChange={formik.handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mb: 2,
            paddingX: 2,
            paddingY: 1,
            width: "fit-content",
            alignSelf: "center",
            fontSize: 18,
            backgroundColor: "#638EFF",
            boxShadow: "0px 0px 7px #638EFF",
          }}
        >
          Сменить пароль
        </Button>
      </Form>
    </Box>
  );
}
