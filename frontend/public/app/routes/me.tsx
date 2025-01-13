import { Container, Stack } from "@mui/material";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, redirect, useLoaderData } from "@remix-run/react";
import { httpClient } from "~/api/http";
import { sessionStorage } from "~/sessions";
import { useMemo } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const accessToken = session.get("access_token");
  const refreshToken = session.get("refresh_token");

  if (!accessToken || !refreshToken) throw redirect("/login");

  const response = await httpClient.getMe()(request);
  if (response.error) {
    if (!refreshToken) throw redirect("/signin");
    const res = await httpClient.refreshAccessToken()(request);
    if (res.error) throw redirect("/signin");
    session.set("access_token", res.data?.access_token);
    const headers = new Headers();
    headers.append("Set-Cookie", await sessionStorage.commitSession(session));
    throw redirect(request.url, { headers });
  }
  return json(response.data);
}

export default function MyAccountLayout() {
  const user = useLoaderData<typeof loader>();

  return (
    <Container sx={{ display: "flex", gap: 2, flexGrow: 1, pt: 2.5, pb: 3 }}>
      <Stack
        spacing={1.5}
        pt={3}
        pr={4}
        pl={3}
        bgcolor={"#FFFFFF"}
        sx={{
          borderRadius: "4px",
          boxShadow: "0px 0px 7px #638EFF",
          fontSize: 18,
        }}
      >
        <Link to={"/me"} style={{ textDecoration: "none", color: "#303044" }}>
          Личная информация
        </Link>
        {/*<Link*/}
        {/*  to={"/me/interface"}*/}
        {/*  style={{ textDecoration: "none", color: "#303044" }}*/}
        {/*>*/}
        {/*  Интерфейс*/}
        {/*</Link>*/}
        <Link
          to={"/me/bookmarks"}
          style={{ textDecoration: "none", color: "#303044" }}
        >
          Закладки
        </Link>
        <Link
          to={"/me/notes"}
          style={{ textDecoration: "none", color: "#303044" }}
        >
          Заметки
        </Link>
        <Link
          to={"/me/tests"}
          style={{ textDecoration: "none", color: "#303044" }}
        >
          Пройденные тесты
        </Link>
        {(user.permissions & 1) === 1 && (
          <a
            href={"https://stoboi.damego.ru/admin"} // TODO: FUCK IT
            style={{ textDecoration: "none", color: "#303044" }}
          >
            Панель управления
          </a>
        )}
      </Stack>

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "gray",
          paddingY: 2.5,
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: "4px",
          boxShadow: "0px 0px 7px #638EFF",
        }}
      >
        <Outlet context={useMemo(() => ({ user }), [user])} />
      </Container>
    </Container>
  );
}
