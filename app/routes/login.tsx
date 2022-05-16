import { createUserSession } from "~/session.server";
import type { ActionFunction } from "remix";

import { useActionData, json, useSearchParams } from "remix";
import { CssBaseline, TextField, Button, Alert } from "@mui/material";

import { login } from "~/session.server";
import styles from "~/styles/login.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
    twoFactorAuthenticationCode?: string;
  };
  requiredTwoFactorAuthentication?: boolean;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

/*
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  console.log("credentials in login session", session?.get('credentials'));
  return null;
};
*/

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const twoFactorAuthenticationCode =
    form.get("twoFactorAuthenticationCode") || undefined;

  const redirectTo = form.get("redirectTo") || "/";
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string" ||
    (twoFactorAuthenticationCode &&
      typeof twoFactorAuthenticationCode !== "string")
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = {
    username,
    password,
    twoFactorAuthenticationCode,
  };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const loginResponse = await login({
    username,
    password,
    twoFactorAuthenticationCode: twoFactorAuthenticationCode?.replace(" ", ""),
  });

  if (loginResponse?.two_factor_authentication_required) {
    /*
    const cookieSession = await getSession(request.headers.get("Cookie"));
    cookieSession.flash("credentials", { username, password }); // Should qr code also be passed along? or should we stay on the same page and hide login/password field?
    return redirect("/sessions/two-factor", {
      headers: {
        "Set-Cookie": await commitSession(cookieSession),
      },
    });
    */
    return badRequest({
      fields,
      requiredTwoFactorAuthentication: true,
    });
  }

  if (
    twoFactorAuthenticationCode &&
    (!loginResponse?.id || !loginResponse?.accessToken)
  ) {
    return badRequest({
      fields,
      requiredTwoFactorAuthentication: true,
      formError: `Two-factor authentication failed`,
    });
  }

  if (!loginResponse?.id || !loginResponse?.accessToken) {
    console.log("bpobo");
    return badRequest({
      fields,
      formError: `Username/Password combination is incorrect`,
    });
  }

  return createUserSession(
    { userId: loginResponse.id, accessToken: loginResponse.accessToken },
    redirectTo
  );
};

export default function Login() {
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
          <h1 className="title">
            {actionData?.requiredTwoFactorAuthentication
              ? "Two-factor authentication"
              : "Sign in"}
          </h1>
          <form method="post" className="form">
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <fieldset
              className="credentials"
              hidden={actionData?.requiredTwoFactorAuthentication}
            >
              <div>
                <TextField
                  type="text"
                  label="Username"
                  name="username"
                  defaultValue={actionData?.fields?.username}
                  error={Boolean(actionData?.fieldErrors?.username)}
                  helperText={actionData?.fieldErrors?.username}
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  fullWidth
                  defaultValue={actionData?.fields?.password}
                  error={Boolean(actionData?.fieldErrors?.password)}
                  helperText={actionData?.fieldErrors?.password}
                />
              </div>
            </fieldset>
            {actionData?.requiredTwoFactorAuthentication && (
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
            )}
            {actionData?.formError && (
              <Alert severity="error">{actionData.formError}</Alert>
            )}
            <Button variant="contained" type="submit" size="large" fullWidth>
              {actionData?.requiredTwoFactorAuthentication ? "Verify" : "Login"}
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
