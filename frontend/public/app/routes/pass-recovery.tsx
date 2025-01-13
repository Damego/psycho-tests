import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import { Typography, Button, Container } from "@mui/material";
import { Form } from "@remix-run/react";
import useAsyncFetcher from "~/hooks/useAsyncFetcher";
import { httpClient, IApiError } from "~/api/http";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import NotifyDialog, {
  NotifyDialogMethods,
} from "~/components/modals/NotifyDialog";
import React, { useRef } from "react";
import StyledInput from "~/components/StyledInput";

export interface IRequestPasswordChangePayload {
  email: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Восстановление пароля | Стобой" },
    { name: "description", content: "Добро пожаловать на сайт Стобой!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const { email }: IRequestPasswordChangePayload = await request.json();

  const res = await httpClient.requestChangeUserPassword(email);
  return json(res);
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Введите корректную почту")
    .required("Почта обязательна к заполнению"),
});

export default function PasswordRecovery() {
  const fetcher = useAsyncFetcher<IApiError>();

  const formik = useFormik<IRequestPasswordChangePayload>({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async ({ email }) => {
      const res = await fetcher.submit(
        { email },
        { method: "POST", encType: "application/json" },
      );

      if (res.error) {
        toast.error(res.error.message);
      } else {
        dialogRef.current?.open();
      }
    },
  });
  const dialogRef = useRef<NotifyDialogMethods>();

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
        gap: 5,
      }}
    >
      <Typography
        component="h5"
        variant="h5"
        color={"#496CC6"}
        fontSize={30}
        pr={8}
      >
        Восстановление пароля
      </Typography>

      {formik.touched.email && formik.errors.email && (
        <Typography color={"#FF7272"} fontSize={18}>
          {formik.errors.email}
        </Typography>
      )}

      <Form
        method="POST"
        onSubmit={formik.handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 128,
          paddingBottom: 15,
        }}
      >
        <StyledInput
          required
          fullWidth
          id="email"
          name="email"
          placeholder="Адрес электронной почты"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mb: 2,
            paddingX: 4,
            paddingY: 1,
            width: "fit-content",
            alignSelf: "center",
            fontSize: 18,
            backgroundColor: "#638EFF",
            boxShadow: "0px 0px 7px #638EFF",
          }}
        >
          Отправить письмо
        </Button>
      </Form>
      <NotifyDialog ref={dialogRef} title={"Сброс пароля"}>
        На указанную вами почту было отправлено письмо с ссылкой. Перейдите по
        ней для смены пароля
      </NotifyDialog>
    </Container>
  );
}
