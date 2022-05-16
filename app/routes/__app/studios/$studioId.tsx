import { json, useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";

import { getStudio } from "~/studio";

type LoaderData = {
  studio: Awaited<ReturnType<typeof getStudio>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(typeof params.studioId === "string");
  const studioId = parseInt(params.studioId, 10)
  invariant(!isNaN(studioId), 'Studio ID needs to be a number');
  const studio = await getStudio(studioId);

  if (!studio) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const data: LoaderData = {
    studio,
  };

  return json(data)
};

export default function StudioRoute() {
  const { studio } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{studio.name}</h1>
      <div>{`Id: ${studio.id}`}</div>
      <div>{studio.description}</div>
      <Link to="/studios">Show all studios</Link>
    </div>
  );
}
