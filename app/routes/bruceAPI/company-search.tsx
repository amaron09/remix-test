import { json } from 'remix'
import { getCompanies } from '~/company'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  const searchOptions = {
    search: search || undefined,
    limit: 10,
  }

  const companies = await Promis.all(getComapnies(request, searchOptions))

  return json(companies)
}