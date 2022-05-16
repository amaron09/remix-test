/** We should probably not use this route as saving passwords in a cookie is not opitmal, even if it only is done temporarily using flash messages */

import { createUserSession, getSession } from "~/session.server";
import type { ActionFunction, LoaderFunction } from "remix";

import { useActionData, json, useSearchParams, redirect } from "remix";
import { CssBaseline, TextField, Button, Divider, Paper } from "@mui/material";

import { login } from "~/session.server";
import styles from "~/styles/login.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type ActionData = {
  formError?: string;
  fields?: {
    twoFactorAuthenticationCode: string;
  };
  requiredTwoFactorAuthentication?: boolean;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }

  if (!session.has("credentials")) {
    // Redirect to the login page if there are no credentials temporarily stored in cookie flash message.
    return redirect("/login");
  }

  return null
}

export const action: ActionFunction = async ({ request }) => {
  const cookieSession = await getSession(
    request.headers.get("Cookie")
  );

  const credentials = cookieSession.get('credentials')

  if (!credentials) {
    return badRequest({
      formError: 'Could not authorize using credentials'
    })
  }

  const form = await request.formData();
  const twoFactorAuthenticationCode = form.get("twoFactorAuthenticationCode");
  if (
    typeof twoFactorAuthenticationCode !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { twoFactorAuthenticationCode };
  
  const session = await login({
    username: credentials?.username,
    password: credentials?.password,
    twoFactorAuthenticationCode:
      (twoFactorAuthenticationCode as string) || undefined,
  }); 

  if (!session?.id || !session?.accessToken) {
    return badRequest({
      fields,
      formError: `Two-factor authentication code is incorrect`,
    });
  }

  return createUserSession(
    { userId: session.id, accessToken: session.accessToken },
    '/', // redirectTo
  );
};

export default function TwoFactorAuthentication() {
  const actionData = useActionData<ActionData>();

  const [searchParams] = useSearchParams();
  return (
    <>
      <CssBaseline />
      <div className="loginContainer">
        <div className="login">
          <img
            className="bruceLogo"
            src="/bruce-logo.svg"
            width={511}
            height={112}
            alt="Bruce"
          />
          <h1 className="title">Two-factor authentication</h1>
          <form method="post" className="form">
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <input
              type="hidden"
              name="username"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <input
              type="hidden"
              name="password"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <div>
              <TextField
                type="string"
                label="Authentication code"
                name="twoFactorAuthenticationCode"
                fullWidth
                helperText="Open the two-factor authenticator (TOTP) app on your mobile
                device to view your authentication code."
              />
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <Button variant="contained" type="submit" size="large" fullWidth>
              Verify
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export function headers() {
  return {
    "X-Frame-Options": "deny",
  };
}
