import { json, redirect } from "@remix-run/node";
import React from "react";

import { apiService } from "../../api/apiService";
import { useLoaderData, useNavigate } from "@remix-run/react";
import ModelTable from "../../components/ModelTable";
import { getTextUserPermissions } from "../../utils/texts";

export async function loader() {
  const res = await apiService.getUsers();
  if (res.error) return json([]);
  return json(res.data);
}

export default function CategoriesAddRoute() {
  const users = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <ModelTable
      showHeader={true}
      headerRoute={"users"}
      headerTitle={"Пользователи"}
      columnTitles={columnTitles}
      columnKeys={columnKeys}
      data={users.map((user) => {
        // Yes I know its dummy thing
        const $user = { ...user };
        $user.is_verified = user.is_verified ? "Да" : "Нет";
        $user.permissions = getTextUserPermissions(user.permissions);
        return $user;
      })}
      onRequestEdit={(user) => {
        navigate(`/users/edit/${user.id}`);
      }}
    />
  );
}

const columnTitles = [
  "Id",
  "Имя",
  "Электронная почта",
  "Подтверждён",
  "Разрешения",
];
const columnKeys = ["id", "name", "email", "is_verified", "permissions"];
