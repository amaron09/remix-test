import { json, useLoaderData, Link, useCatch } from "remix";
import type { LoaderFunction } from "remix";
import { verifyUserRole } from "~/session.server";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  await verifyUserRole(request, "admin");

  const data: LoaderData = {};

  return json(data);
};

export default function UsersIndexRoute() {
  return (
    <div>
      <iframe
        id="legacyAdminIframe"
        title="Legacy Admin IFrame"
        width="300"
        height="200"
        src={`http://localhost:3000/en/legacy/users`}
      ></iframe>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}
