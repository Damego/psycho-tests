import {
  Box,
  Checkbox,
  FormLabel,
  Button,
  Typography,
  Stack,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { IUser } from "../../api/types/users";
import { userHasPermission, UserPermissions } from "../../api/types/enums";
import { useFetcher, useNavigate } from "@remix-run/react";
import useFetcherAsync from "~/hooks/useFetcherAsync";
import { toast } from "react-toastify";
import { IApiResponse } from "api/httpClient";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Введите корректную почту")
    .required("Почта обязательна к заполнению"),
  password: yup
    .string()
    .min(8, "Длина пароля должна быть как минимум из 8 символов")
    .required("Пароль обязателен к заполнению"),
  name: yup.string().required("Имя обязательно к заполнению"),
});

const UserForm = ({ user }: { user?: IUser }) => {
  const fetcher = useFetcherAsync<IApiResponse<null>>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      permissions: [],
    },
    validationSchema,
    onSubmit: async ({ name, email, password, permissions }) => {
      const user = {
        name,
        email,
        password,
        permissions: permissions.reduce((acc, sum) => sum + acc, 0),
      };
      const res = await fetcher.submit({ user }, { method: "POST", encType: "application/json" });
      if (!res.error) {
        toast.success(`Пользователь ${user ? "добавлен!" : "сохранён!"}`);
        navigate("/users/list");
      }
      else {
        toast.error(res.error.message);
      }
    },
  });

  return (
    <Box sx={{ width: "30vw" }}>
      <Typography variant={"h4"} fontWeight={"800"} sx={{ marginBottom: 2 }}>
        {user ? "Редактирование" : "Создание"} пользователя
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{backgroundColor: "#FFFFFF", borderRadius: "4px", padding: 8}}>
        <Stack spacing={2}>
          <TextField
            name={"name"}
            id={"name"}
            label={"Имя"}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            name={"email"}
            id={"email"}
            label={"Электронная почта"}
            type={"email"}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            name={"password"}
            id={"password"}
            label={"Пароль"}
            type={"password"}
            autoComplete={"new-password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <FormLabel>Разрешения</FormLabel>
          <FormControlLabel
            name={"permissions"}
            id={"permissions"}
            onChange={formik.handleChange}
            control={
              <Checkbox
                value={1}
                defaultChecked={
                  user?.permissions
                    ? userHasPermission(
                        user?.permissions,
                        UserPermissions.ADMINISTRATOR,
                      )
                    : false
                }
              />
            }
            label="Администратор"
          />

          <Button
            sx={{ marginTop: 4 }}
            color={"primary"}
            variant={"contained"}
            type="submit"
          >
            {user ? "Сохранить" : "Создать"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UserForm;
