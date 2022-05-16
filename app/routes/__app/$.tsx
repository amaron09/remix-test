/* Splat route used for only showing 404 when logged in */
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async () => {
  throw new Response("Not Found", {
    status: 404,
  });
};

export default function NotFoundRoute() {
  return;
}
