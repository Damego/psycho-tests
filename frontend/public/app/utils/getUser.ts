import { redirect } from "@remix-run/react";

import { sessionStorage } from "~/sessions";
import { httpClient } from "~/api/http";

const getUser = async (request: Request) => {
  const userRes = await httpClient.getMe()(request);
  if (userRes.data)
    return redirect("/me", { headers });
  return null;
}

export default getUser;
