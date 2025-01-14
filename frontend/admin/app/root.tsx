import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,

} from "@remix-run/react";

import {
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import React from "react";
import Header from "./components/Header";
import { apiService } from "../api/apiService";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { sessionStorage } from "~/sessions";
import "./styles/global.css";
import Footer from "~/components/Footer";
import { withEmotionCache } from '@emotion/react';
import { Box, Container, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import theme from './mui/theme';
import ClientStyleContext from './mui/ClientStyleContext';

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.url.endsWith("/signin")) return null;
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const accessToken = session.get("access_token");
  const refreshToken = session.get("refresh_token");

  if (!accessToken && !refreshToken) throw redirect("/signin");

  apiService.setCredentialsTokens({ accessToken, refreshToken });

  const response = await apiService.getMe();
  if (response.error) {
    if (!refreshToken) throw redirect("/signin");
    const res = await apiService.refreshAccessToken();
    if (res.error) throw redirect("/signin");
    session.set("access_token", res.data?.access_token);
    const headers = new Headers();
    headers.append("Set-Cookie", await sessionStorage.commitSession(session));
    throw redirect(request.url, { headers });
  }

  // if ((response.data?.permissions! & 1) !== 1) {
  //   return redirectDocument("https://stoboi.damego.ru/"); // TODO: FUCK IT
  // }

  return null;
}

// export function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
      
//     </>
//   );
// }



interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(({ children, title }: DocumentProps, emotionCache) => {
  const clientStyleData = React.useContext(ClientStyleContext);

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <meta name="emotion-insertion-point" content="emotion-insertion-point" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ToastContainer position={"bottom-right"} />
      </body>
    </html>
  );
});

// https://remix.run/docs/en/main/route/component
// https://remix.run/docs/en/main/file-conventions/routes
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
        break;
      case 404:
        message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
        break;

      default:
        throw new Error(error.data || error.statusText);
    }

    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <h1>
          {error.status}: {error.statusText}
        </h1>
        {message}
      </Document>
    );
  }

  if (error instanceof Error) {
    console.error(error);
    return (
      <Document title="Error!">
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>Hey, developer, you should replace this with what you want your users to see.</p>
        </div>
      </Document>
    );
  }

  return <h1>Unknown Error</h1>;
}