import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import React from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { apiService } from "../../api/apiService";
import TestForm from "~/components/tests/TestForm";
import useFetcherAsync from "~/hooks/useFetcherAsync";
import { toast } from "react-toastify";

export const meta: MetaFunction = () => {
  return [{ title: "Тесты" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const raw_testId = params.testId;

  if (!raw_testId) {
    throw redirect("/tests");
  }

  const testId = Number.parseInt(raw_testId);
  if (Number.isNaN(testId)) {
    throw redirect("/tests");
  }

  const res = await apiService.getTestById(testId);

  if (!res.data) {
    throw redirect("/tests");
  }

  return json(res.data);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { _action, test } = await request.json();

  if (_action === "edit-test") {
    const res = await apiService.updateTest(test.id, test);
    return json(res);
  } else if (_action === "delete-test") {
    const res = await apiService.deleteTest(Number.parseInt(params.testId!));
    return json(res);
  }
}

export default function EditTestRoute() {
  const navigate = useNavigate();
  const fetcher = useFetcherAsync();

  const test = useLoaderData<typeof loader>();

  const handleTestDelete = async () => {
    const res = await fetcher.submit(
      { _action: "delete-test" },
      { method: "POST", encType: "application/json" },
    );
    if (!res.error) {
      toast.success("Тест удалён");
      navigate("/tests");
    }
  };

  return <TestForm initialTest={test} onDelete={handleTestDelete} />;
}
