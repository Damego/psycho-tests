import { httpClient } from "~/api/http";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Stack } from "@mui/material";
import UserPersonalSection from "~/components/userSettings/UserPersonalSection";
import UserSecuritySection from "~/components/userSettings/UserSecuritySection";
import {sessionStorage} from "~/sessions";
import {redirect} from "@remix-run/react";

export interface UserActionPayload {
  name?: string;
  goal?: "change-email" | "change-password" | "logout";
  email?: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const { name, goal, email }: UserActionPayload = await request.json();

  if (name) {
    const res = await httpClient.changeUserName(name)(request);
    return json(res);
  }

  if (goal === "change-email") {
    const res = await httpClient.requestChangeUserEmail(email!)(request);
    return json(res);
  } else if (goal === "change-password") {
    const res = await httpClient.requestChangeUserPassword()(request);
    return json(res);
  }
  else if (goal === "logout") {
    const session = await sessionStorage.getSession(
      request.headers.get("cookie"),
    );

    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  return null;
}

export default function MyAccountUser() {
  return (
    <Stack>
      <UserPersonalSection />
      <UserSecuritySection />
    </Stack>
  );
}
