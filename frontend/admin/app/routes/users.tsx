import { MetaFunction } from "@remix-run/node";
import React from "react";
import { Outlet } from "@remix-run/react";
import Page from "../../components/Page";

export const meta: MetaFunction = () => {
  return [{ title: "Пользователи" }];
};

export default function UsersLayout() {
  return (
    <Page route={"users"}>
      <Outlet />
    </Page>
  );
}
