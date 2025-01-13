import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import React from "react";

import { apiService } from "../../api/apiService";
import UserForm from "../../components/modelForms/UserForm";
import { useLoaderData } from "@remix-run/react";
import { Typography } from "@mui/material";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.userId || Number.isNaN(Number.parseInt(params.userId))) {
    throw redirect("/users/list");
  };

  const res = await apiService.getUser(Number(params.userId as string));
  return json(res);
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json();
  const { userId, user } = data;
  const res = await apiService.updateUser(userId, user);
  return json(res);
}

export default function EditUserRoute() {
  const res = useLoaderData<typeof loader>();

  if (!res || res.error) {
    return <Typography variant={"h1"}>Пользователь не найден</Typography>;
  }

  return <UserForm user={res.data} />;
}
