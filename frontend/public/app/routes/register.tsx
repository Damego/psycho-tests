import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Container, Typography, Button } from "@mui/material";
import { Form, Link } from "@remix-run/react";
import { redirect } from "react-router";
import getUserLoader from "~/utils/getUser";
import { useFormik } from "formik";
import StyledInput from "~/components/StyledInput";
import * as yup from "yup";
import { httpClient, IApiError } from "~/api/http";
import useAsyncFetcher from "~/hooks/useAsyncFetcher";
import { toast } from "react-toastify";

interface IUserRegisterForm {
  username: string;
  email: string;
  password: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Регистрация | Стобой" },
    { name: "description", content: "Добро пожаловать на сайт Стобой!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return await getUserLoader(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const { username, email, password }: IUserRegisterForm = await request.json();

  const res = await httpClient.signUp(username, email, password)(request);

  if (res.error) {
    return res.error;
  }

  return redirect(`/acc-confirm?email=${email}`);
}

const validationSchema = yup.object({
  username: yup.string().required("Имя пользователя обязательно к заполнению"),
  email: yup
    .string()
    .email("Введите корректную почту")
    .required("Почта обязательна к заполнению"),
  password: yup
    .string()
    .min(8, "Длина пароля должна быть как минимум из 8 символов")
    .required("Пароль обязателен к заполнению"),
});

export default function RegisterRoute() {
  const fetcher = useAsyncFetcher<IApiError>();

  const formik = useFormik<IUserRegisterForm>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async ({ username, email, password }) => {
      const error = await fetcher.submit(
        { username, email, password },
        { method: "POST", encType: "application/json" },
      );

      if (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <Container
      maxWidth={"sm"}
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
        Регистрация
      </Typography>

      <Typography color={"#FF7272"} fontSize={18}>
        {(formik.touched.username && formik.errors.username) ||
          (formik.touched.email && formik.errors.email) || (
            formik.touched.password && formik.errors.password
          )}
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
          id="username"
          name="username"
          placeholder="Имя пользователя"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        <StyledInput
          fullWidth
          id="email"
          name="email"
          placeholder="Электронная почта"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
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
          Зарегистрироваться
        </Button>
      </Form>

      <Link
        to={"/login"}
        style={{
          textDecoration: "none",
          fontSize: 18,
          color: "#496CC6",
          alignSelf: "center",
        }}
      >
        Уже зарегистрированы? Войдите
      </Link>
    </Container>
  );
}
