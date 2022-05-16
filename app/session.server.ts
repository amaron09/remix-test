import { createCookieSessionStorage, redirect, json } from "remix";
import type { User } from "~/types/user";

type LoginForm = {
  username: string;
  password: string;
  twoFactorAuthenticationCode?: string;
};

type Session = {
  id: number;
  user_id: number;
  access_token: string;
  created_at: string;
  expires_at: string;
  role: string;
  device_identifier: string;
  user_agent: string;
};

export async function login({
  username,
  password,
  twoFactorAuthenticationCode,
}: LoginForm) {

  const sessionResponse = await fetch(
    `${process.env.API_URL}/v${process.env.API_VERSION}/session`,
    {
      method: "POST",
      body: JSON.stringify({
        email: username,
        password,
        ...(twoFactorAuthenticationCode && {
          "2fa_token": twoFactorAuthenticationCode,
        }),
      }),
    }
  );

  const sessionResponseData = await sessionResponse.json();

  const {
    session,
    error,
  }: {
    session?: Session;
    error?: {
      status_code: number;
      code: string;
      message: string;
      meta?: {
        qr_code: string;
      };
    };
  } = sessionResponseData;

  if (error?.code === "2FA_REQUIRED" && error?.meta?.qr_code) {
    return {
      two_factor_authentication_qr_code: error.meta.qr_code,
    };
  }

  if (error?.code === "2FA_REQUIRED") {
    return {
      two_factor_authentication_required: true,
    };
  }

  if (!session?.user_id || !session?.access_token) {
    return null;
  }

  return { id: session.user_id, username, accessToken: session.access_token };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "bruce_user_session",
      // normally you want this to be `secure: true`
      // but that doesn't work on localhost for Safari
      // https://web.dev/when-to-use-local-https/
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });

function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getAccessToken(request: Request) {
  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken || typeof accessToken !== "string") return null;
  return accessToken;
}

export async function requireAccessToken(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken || typeof accessToken !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return accessToken;
}

export async function requireUserSession(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  const accessToken = session.get("accessToken");
  if (
    (!userId && !accessToken) ||
    typeof accessToken !== "string" ||
    typeof userId !== "number"
  ) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return session;
}

export async function getUser(request: Request): Promise<User | null> {
  const userId = await getUserId(request);
  const accessToken = await getAccessToken(request);

  if (typeof userId !== "number" || typeof accessToken !== "string") {
    return null;
  }

  try {
    const headers = new Headers();
    headers.append("x-access-token", accessToken);

    const response = await fetch(
      `${process.env.API_URL}/v${process.env.API_VERSION}/user/${userId}`,
      { headers }
    );

    const { user } = await response.json();
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function createUserSession(
  { userId, accessToken }: { userId: number; accessToken: string },
  redirectTo: string
) {
  const session = await getSession();
  session.set("userId", userId);
  session.set("accessToken", accessToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function verifyUserRole(
  request: Request,
  expectedRole: "admin" | "staff"
): Promise<User> {
  const user = await getUser(request);
  if (user?.role === expectedRole) return user;
  throw json({ message: "Forbidden" }, { status: 403 });
}

export { getSession, commitSession, destroySession };
