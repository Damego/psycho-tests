import useAsyncFetcher from "~/hooks/useAsyncFetcher";
import { IApiResponse } from "~/api/http";
import { Form, redirect, useOutletContext } from "@remix-run/react";
import { IUser } from "~/api/types/users";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import React, { useRef } from "react";
import { Box, Button, InputLabel, Stack, Typography } from "@mui/material";
import StyledInput from "~/components/StyledInput";
import * as yup from "yup";
import NotifyDialog, {
  NotifyDialogMethods,
} from "~/components/modals/NotifyDialog";
import { sessionStorage } from "~/sessions";

const validationSchema = yup.object({
  email: yup.string().required("Имя пользователя обязательно к заполнению"),
});

export default function UserSecuritySection() {
  const fetcher = useAsyncFetcher<IApiResponse<any>>();
  const { user } = useOutletContext<{ user: IUser }>();
  const emailDialogRef = useRef<NotifyDialogMethods>();
  const passwordDialogRef = useRef<NotifyDialogMethods>();

  const formik = useFormik<{ email: string }>({
    initialValues: {
      email: user.email,
    },
    onSubmit: async ({ email }: { email: string }) => {
      if (user.email === email) {
        toast.warning("Вы указали текущую почту");
        return;
      }

      const res = await fetcher.submit(
        {
          goal: "change-email",
          email,
        },
        { method: "POST", encType: "application/json" },
      );

      if (res?.error) {
        toast.error(res.error.message);
        return;
      }
      emailDialogRef.current?.open();
    },
    validationSchema,
  });

  const resetPassword = async () => {
    const res = await fetcher.submit(
      { goal: "change-password" },
      { method: "POST", encType: "application/json" },
    );
    if (res?.error) {
      toast.error(res?.error.message);
    } else {
      passwordDialogRef.current?.open();
    }
  };

  const logOut = () =>
    fetcher.submit(
      { goal: "logout" },
      { method: "POST", encType: "application/json" },
    );

  return (
    <React.Fragment>
      <Typography fontSize={30} color={"#496CC6"} mb={2} mt={2}>
        Безопасность
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
                Электронная почта
              </Typography>
            </InputLabel>
            <StyledInput
              required
              id="email"
              name="email"
              placeholder={"Имя пользователя"}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Stack>
          {formik.values.email !== user.email && (
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
                Изменить
              </Button>
            </Box>
          )}
        </Stack>
      </Form>

      <Button
        onClick={resetPassword}
        sx={{
          mt: 2,
          fontSize: 14,
          borderRadius: "4px",
          boxShadow: "0px 0px 7px #638EFF",
          width: "fit-content",
          padding: "12px 16px 12px 16px",
        }}
      >
        Сбросить пароль
      </Button>

      <Button
        onClick={logOut}
        sx={{
          mt: 2,
          fontSize: 14,
          borderRadius: "4px",
          boxShadow: "0px 0px 7px #EF5350",
          width: "fit-content",
          padding: "12px 16px 12px 16px",
          color: "#EF5350",
        }}
      >
        Выйти из учётной записи
      </Button>

      <NotifyDialog ref={passwordDialogRef} title={"Сброс пароля"}>
        На ваш адрес электронной почты была отправлена ссылка для сброса пароля.
        Перейдите по ней.
      </NotifyDialog>
      <NotifyDialog
        ref={emailDialogRef}
        title={"Изменение адреса электронной почты"}
      >
        На указанную вами почту было отправлено письмо с ссылкой. Перейдите по
        ней для подтверждения изменения адреса электронной почты
      </NotifyDialog>
    </React.Fragment>
  );
}
