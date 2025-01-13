import { MetaFunction, redirect } from "@remix-run/node";
import "@mdxeditor/editor/style.css";
import React from "react";
import Page from "../../components/Page";

export const meta: MetaFunction = () => {
  return [{ title: "Панель управления сайтом" }];
};

export async function loader() {
  throw redirect("/categories/list")
}

export default function Index() {
  return (
    <Page>
      <p>Перенаправление...</p>
    </Page>
  );
}