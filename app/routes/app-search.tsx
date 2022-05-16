import { json } from "remix";
import { getStudios } from "~/studio";
import { getUsers } from "~/user";

import type { LoaderFunction } from "remix";

type LoaderData = {
  studios: Awaited<ReturnType<typeof getStudios>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  console.log("search", search);

  const searchOptions = {
    search: search || undefined,
    limit: 10,
  }

  const [studios, users] = await Promise.all([
    getStudios(request, searchOptions),
    getUsers(request, searchOptions),
  ]);

  const studioOptions = studios.map((studioItem) => ({
    id: studioItem.id,
    title: studioItem.name,
    type: "studio",
    details: {
      city_id: studioItem.city_id,
      tier_level: studioItem.tier_level,
      photo: studioItem.photo
    },
  }));

  const userOptions = users.map((userItem) => ({
    id: userItem.id,
    title: `${userItem.first_name} ${userItem.last_name}`,
    type: "user",
    details: {
      city_id: userItem.city_id,
      tier_level: userItem.tier_level,
      photo: userItem.photo
    },
  }));

  const data: LoaderData = {
    studios,
  };

  return json([
    ...studioOptions,
    ...userOptions
  ], 200);
};

/*
type LoaderData = {
  studios: Awaited<ReturnType<typeof getStudios>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await verifyUserRole(request, "admin");

  const studios = await getStudios(request);

  const data: LoaderData = {
    studios,
  };
  */
