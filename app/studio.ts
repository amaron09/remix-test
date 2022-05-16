import {
  getAccessToken,
  requireAccessToken,
  verifyUserRole,
} from "~/session.server";

export type Studio = {
  id: number;
  name: string;
  description: string;
  integration_type: string;
  city_id: number;
  photo: string;
  status: string;
  tier_level: number;
};

export async function getStudios(
  request: Request,
  options: {
    limit?: number;
    search?: string;
  } = {}
): Promise<Studio[]> {
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
      `${process.env.API_URL}/v${process.env.API_VERSION}/studio${
        params ? `?${params}` : ""
      }`,
      { headers }
    );

    const { studios } = await response.json();
    return studios;
  } catch {
    throw new Error("Could not fetch studios");
  }
}

export async function getStudio(studioId: number): Promise<Studio> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/v${process.env.API_VERSION}/studio/${studioId}`
    );

    const { studio } = await response.json();
    return studio;
  } catch {
    throw new Error("Could not fetch studio");
  }
}

export async function createStudio(
  request: Request,
  { name, email }: { name: string; email: string }
): Promise<Studio> {
  const accessToken = await getAccessToken(request);

  try {
    const headers = new Headers();
    if (accessToken) {
      headers.append("x-access-token", accessToken);
    }

    const response = await fetch(
      `${process.env.API_URL}/v${process.env.API_VERSION}/studio`,
      {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers,
      }
    );

    const { studio } = await response.json();
    return studio;
  } catch {
    throw new Error("Could not create studio");
  }
}
