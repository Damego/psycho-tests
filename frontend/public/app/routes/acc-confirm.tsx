import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Container, Typography, Button, Stack } from "@mui/material";
import { getEmailAddressDomain } from "~/utils/getEmailAddressDomain";
import { Link, redirect, useLoaderData, useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Подтверждение аккаунта | Стобой" },
    { name: "description", content: "Добро пожаловать на сайт Стобой!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    throw redirect("/login");
  }

  return json(getEmailAddressDomain(email));
}

export default function AccountConfirmRoute() {
  const addressDomain = useLoaderData<typeof loader>();

  return (
    <Container
      maxWidth={"xs"}
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        p: 3,
        borderRadius: "4px",
        boxShadow: "0px 0px 7px #638EFF",
        height: "fit-content",
        gap: 5,
      }}
    >
      <Typography component="h5" variant="h5" color={"#496CC6"} fontSize={30}>
        Подтверждение аккаунта
      </Typography>

      <Typography color={"#496CC6"} fontSize={18} pr={4}>
        Вы успешно зарегистрировались!
        <br />
        На вашу почту было отправлено письмо для подтверждения регистрации.
        <br />
        Перейдите по ссылке, чтобы подтвердить аккаунт.
      </Typography>

      <Stack alignItems={"center"}>
        <Link
          to={addressDomain.url}
          style={{ height: "", color: "inherit", textDecoration: "none" }}
        >
          <Button
            type="button"
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              paddingX: 7,
              paddingY: 1,
              width: "fit-content",
              fontSize: 18,
              backgroundColor: "#638EFF",
              boxShadow: "0px 0px 7px #638EFF",
            }}
          >
            Перейти в {addressDomain.name}
          </Button>
        </Link>

        {/*<Button*/}
        {/*  type="button"*/}
        {/*  variant="text"*/}
        {/*  sx={{*/}
        {/*    width: "fit-content",*/}
        {/*    fontSize: 16,*/}
        {/*    textTransform: "none",*/}
        {/*    fontWeight: "400",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Отправить письмо повторно*/}
        {/*</Button>*/}
      </Stack>
    </Container>
  );
}
