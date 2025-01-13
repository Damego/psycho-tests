import React from "react";

import { apiService } from "../../api/apiService";
import UserForm from "../../components/modelForms/UserForm";
import { ActionFunctionArgs, json } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json();
  const { user } = data;
  const res = await apiService.createUser(user);
  return json(res);
}

export default function CategoriesAddRoute() {
  return <UserForm />;
}
