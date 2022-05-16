import { json, Outlet, useLoaderData, redirect } from "remix";
import type { LoaderFunction } from "remix";
import { AppLayout, links as appLayoutLinks } from "~/components/AppLayout";

import { requireUserSession, getUser } from "~/session.server";

export const links = () => {
  return [...appLayoutLinks()];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);

  const user = await getUser(request);

  if (!user || user.error) {
    throw redirect("/login", 302);
  }
  
  const data: LoaderData = {
    user,
  };

  return json(data);
};

export default function StudiosRoute() {
  const data = useLoaderData<LoaderData>();
  const { user } = data;

  return (
    <div className="dashboard">
      <AppLayout user={user}>
        <Outlet />
      </AppLayout>
    </div>
  );
}
