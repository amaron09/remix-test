import { json, useLoaderData, useParams } from 'remix'
import type { LoaderFunction } from "remix";
import { verifyUserRole } from '~/session.server'
import { getCompany } from "~/company";

type LoaderData = {
  company: Awaited<ReturnType<typeof getCompany>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await verifyUserRole(request, 'admin')

  const { companyId } = params

  const company = await getCompany(request, {
    company_id: companyId,
    include_credits: 'true',
    include_agreements: 'true',
    include_user_statistic: 'true',
    include_credits_payment: 'true',
    include_ambassador: 'true',
  })

  return json(company)
}

export default function CompanyId() {
  const company = useLoaderData<LoaderData>()
  const params = useParams()
  console.log("company", company)
  console.log(" useLoaderData",  useLoaderData())
  return (
    <div>
      <h1>{company.name}</h1>
    </div>
  )
}