import { createCookieSessionStorage } from "@remix-run/node";
import { authCookie } from "~/cookies";

export const sessionStorage = createCookieSessionStorage({
  cookie: authCookie,
});
