import { json, useLoaderData, Link, useCatch, useSearchParams } from "remix";

import type { LoaderFunction } from "remix";

import {
  useParams,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";

import Pagination from "~/components/Pagination";
import BreadCrumbs from "~/components/BreadCrumbs";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { getCompanies } from "~/company";
import { verifyUserRole } from "~/session.server";

type LoaderData = {
  companies: Awaited<ReturnType<typeof getCompanies>>;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await verifyUserRole(request, "admin");

  const url = new URL(request.url);
  const paginationDirection = url.searchParams.get('direction');
  const prevParam = url.searchParams.get('page');
  const nextParam = url.searchParams.get('page');
  const searchParam = url.searchParams.get('search')

  console.log("SERVER REQUEST", request)

  const companies = await getCompanies(request, {
    limit: 25,
    include_revenue_statistic: true,
    include_user_statistic: true,
    prev_cursor: paginationDirection === 'prev' ? prevParam : undefined,
    next_cursor: paginationDirection === 'next' ? nextParam : undefined,
    search: searchParam ? searchParam : undefined,
  })
  const data: LoaderData = {
    companies,
  }

  console.log("SERVER RESPONSE DATA", data)
  return json(data.companies)
}

export default function CompaniesIndexRoute() {
  const { companies, metadata } = useLoaderData<LoaderData>()
  const [searchParams, setSearchParams] = useSearchParams();

  const nextCursor: string = metadata?.pagination?.next_cursor
  const prevCursor: string = metadata?.pagination?.prev_cursor

  const rows = companies.map((companyItem) => ({
    id: companyItem.id,
    col1: companyItem.id,
    col2: companyItem.name,
    col3: companyItem.client_manager,
    col4: 0,
    col5: 0,
    col6: 0,
  }))

  /* const columns: GridColDef[] = [
    { field: "col1", headerName: "ID", width: 50 },
    { field: "col2", headerName: "Name", flex: 2 },
    { field: "col3", headerName: "Status", flex: 1 },
    { field: "col4", headerName: "Integration", flex: 1 },
    { field: "col5", headerName: "City", flex: 1 },
    { field: "col6", headerName: "Tier", flex: 1 },
    {
      field: "col7",
      headerName: "QR",
      width: 50,
      filterable: false,
      sortable: false,
    },
  ]; */

  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
    { id: 'clientManager', label: 'Client manager' },

  ]

  const submit = useSubmit()

  console.log("params", searchParams)
  console.log("companies", companies)

  return (
    <div>
      <BreadCrumbs />
      <div>
        <h2>Companies</h2>
        <Link to="/companies/create">+</Link>
      </div>

      <form
        method="get"
      >
        <input
          type="checkbox"
          id="test"
          name="test"
          value="test"
          onChange={(e) => submit(e.currentTarget.form)}
        />
        <input
          type="text"
          id="search"
          name="search"
          onChange={(e) => submit(e.currentTarget.form)}
        />
      </form>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((companyColumn) => (
                  <TableCell
                    key={companyColumn.id}
                  >
                    {companyColumn.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((rowItem) => (
                <TableRow
                  key={rowItem.id}
                >
                  <TableCell>{rowItem.col1}</TableCell>
                  <TableCell>
                    <Link to={`/companies/${rowItem.id}`}>{rowItem.col2}</Link>
                  </TableCell>
                  <TableCell>{rowItem.col3}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Pagination
        prevCursor={prevCursor}
        nextCursor={nextCursor}
      />
    </div>
  )
}