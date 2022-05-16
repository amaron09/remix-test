import { requireAccessToken } from "~/session.server";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo: string | null;
  city_id: number;
  tier_level: number;
};

export async function getUsers(
  request: Request,
  options: {
    limit?: number;
    search?: string;
  } = {}
): Promise<User[]> {
  const accessToken = await requireAccessToken(request);
  const { limit = 10, search } = options;

  const params = new URLSearchParams({
    ...(search && { search: search as string }),
    ...(limit && { limit: limit as unknown as string }),
  });

  params.sort();

  try {
    const headers = new Headers();
    headers.append("x-access-token", accessToken);

    const response = await fetch(
      `${process.env.API_URL}/v${process.env.API_VERSION}/user${
        params ? `?${params}` : ""
      }`,
      { headers }
    );

    const { users } = await response.json();
    return users;
  } catch {
    throw new Error("Could not fetch users");
  }
}
