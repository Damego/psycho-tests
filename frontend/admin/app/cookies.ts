import {createCookie} from "@remix-run/node";

export const authCookie = createCookie("__session", {
  maxAge: 30 * 60 * 60 * 24,
  httpOnly: true,
  path: "/",
  sameSite: "none", // TODO: CHANGE,
  secure: true,
});
