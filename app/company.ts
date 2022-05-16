import {
  getAccessToken,
  requireAccessToken,
  verifyUserRole,
} from "~/session.server";
import {
  bruceAPI,
} from "~/constants";

export type Company = {
  id: number;
  name: string;
  description: string;
  integration_type: string;
  city_id: number;
  photo: string;
  status: string;
  tier_level: number;
};

export async function getCompanies(
  request: Request,
  options: {
    limit?: number;
    search?: string;
    include_revenue_statistic?: boolean;
    include_user_statistic?: boolean;
    prev_cursor?: string | null | undefined;
    next_cursor?: string | null | undefined;
  } = {}
): Promise<Company[]> {
  const accessToken = await requireAccessToken(request);
  const {
    limit = 10,
    prev_cursor,
    next_cursor,
    search,
    include_revenue_statistic,
    include_user_statistic,
  } = options;

  const params = new URLSearchParams({
    ...(search && { search: search as string }),
    ...(limit && { limit: limit as unknown as string }),
    ...(include_revenue_statistic && { include_revenue_statistic: include_revenue_statistic as unknown as string }),
    ...(include_user_statistic && { include_user_statistic: include_user_statistic as unknown as string }),
    ...(prev_cursor && { prev_cursor: prev_cursor as unknown as string }),
    ...(next_cursor && { next_cursor: next_cursor as unknown as string }),
  });

  params.sort();

  console.log("params", params)

  try {
    const headers = new Headers();
    headers.append("x-access-token", accessToken);

    const response = await fetch(
      `${bruceAPI}/company${
        params ? `?${params}` : ""
      }`,
      { headers }
    );

    const data = await response.json();

    return data;
  } catch {
    throw new Error("Could not fetch companies")
  }
}

export async function getCompany(
  request: Request,
  options: {
    company_id: string;
    include_credits?: string;
    include_agreements?: string;
    include_user_statistic?: string;
    include_credits_payment?: string;
    include_ambassador?: string;
  },
  ): Promise<Company> {
  const accessToken = await requireAccessToken(request);
  const {
    company_id,
    include_credits,
    include_agreements,
    include_user_statistic,
    include_credits_payment,
    include_ambassador,
  } = options
  const headers = new Headers();
  headers.append("x-access-token", accessToken);
 
  const params = new URLSearchParams({
    ...(company_id && { company_id: company_id as string }),
    ...(include_credits && { include_credits: include_credits as string }),
    ...(include_agreements && { include_agreements: include_agreements as string }),
    ...(include_user_statistic && { include_user_statistic: include_user_statistic as string }),
    ...(include_credits_payment && { include_credits_payment: include_credits_payment as string }),
    ...(include_ambassador&& { include_ambassador: include_ambassador as string }),
  })
  
  try {
    const response = await fetch(
      `${bruceAPI}/company/${company_id}${
        params ? `?${params}` : ""
      }`,
      { headers }
    );
    console.log("response", response)
    const { company } = await response.json();

    return company;
  } catch {
    throw new Error("Could not fetch company");
  }
}

export async function createCompany(
  request,
  params,
) {
  const accessToken = await requireAccessToken(request);

  const body = {
    ...params,
  }
  
  /* const headers = new Headers();
  headers.append("x-access-token", accessToken);
  headers.append("method", 'POST')
  headers.append("body", JSON.stringify(body))

  console.log("headers", headers) */
  try {
    const response = await fetch(
      `${bruceAPI}/company`,
      {
        method: 'POST',
        headers: {
          'x-access-token': accessToken,
        },
        body: JSON.stringify(body),
      }
    )
    console.log("post response", response)
    const responseData = await response.json()
    console.log("response data", responseData)
  } catch {
    throw new Error("Could not create company")
  }
}