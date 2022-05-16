import { json, Outlet, useLoaderData, Link, redirect} from "remix";
import type { LoaderFunction } from "remix";
import { Button } from "@mui/material";

import { requireUserSession, getUser, requireUserId, requireAccessToken } from "~/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  // See https://remix.run/docs/en/v1/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
  await requireUserSession(request)
  /*
  const session = await requireUserSession(request);
  const userId = await requireUserId(request)
  console.log('session', session)
  console.log('userId', userId)
  */

  const user = await getUser(request);

  if (!user || user.error) {
    throw redirect("/login", 302);
  }
  
  const data: LoaderData = {
    user,
  };

  return json(data);
};

export default function StudiosRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <main>
        <Outlet />
      </main>
      {data.user ? (
        <div className="user-info">
          <span>{`Hi ${data.user.first_name}`}</span>
          <form action="/logout" method="post">
            <Button variant="contained" type="submit">
              Logout
            </Button>
          </form>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
