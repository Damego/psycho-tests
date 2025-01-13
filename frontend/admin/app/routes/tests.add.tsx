import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import React from "react";

import { apiService } from "../../api/apiService";
import TestForm from "~/components/tests/TestForm";

export const meta: MetaFunction = () => {
  return [{ title: "Добавление теста" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const { test } = await request.json();
  const res = await apiService.addTest(test);
  return json(res);
}

export default function AddTestRoute() {
  return <TestForm />;
}
