import { MetaFunction, redirect } from "@remix-run/node";
import React from "react";
import Page from "../../components/Page";

export const meta: MetaFunction = () => {
  return [{ title: "Панель управления сайтом" }];
};

export async function loader() {
  throw redirect("/tests")
}

export default function Index() {
  return (
    <Page>
      <p>Перенаправление...</p>
    </Page>
  );
}