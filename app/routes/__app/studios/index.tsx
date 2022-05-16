import { json, useLoaderData, Link, useCatch } from "remix";
import type { LoaderFunction } from "remix";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";

import { getStudios } from "~/studio";
import { verifyUserRole } from "~/session.server";

type LoaderData = {
  studios: Awaited<ReturnType<typeof getStudios>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await verifyUserRole(request, "admin");

  const studios = await getStudios(request, { limit: 25 });

  const data: LoaderData = {
    studios,
  };

  return json(data);
};

export default function StudiosIndexRoute() {
  const { studios } = useLoaderData<LoaderData>();

  function getCityName({ value }: { value: number }) {
    switch (value) {
      case 1:
        return "Stockholm";
      case 2:
        return "Göteborg";
      default:
        return "–";
    }
  }

  function getTierName({ value }: { value: number }) {
    switch (value) {
      case 1:
        return "Base";
      case 2:
        return "Black";
      default:
        return "–";
    }
  }

  const rows = studios.map((studioItem) => ({
    id: studioItem.id,
    col1: studioItem.id,
    col2: studioItem.name,
    col3: studioItem.status,
    col4: studioItem.integration_type,
    col5: studioItem.city_id,
    col6: studioItem.tier_level,
    col7: "QR",
  }));

  const columns: GridColDef[] = [
    { field: "col1", headerName: "ID", width: 50 },
    { field: "col2", headerName: "Name", flex: 2 },
    { field: "col3", headerName: "Status", flex: 1 },
    { field: "col4", headerName: "Integration", flex: 1 },
    { field: "col5", headerName: "City", flex: 1, valueGetter: getCityName },
    { field: "col6", headerName: "Tier", flex: 1, valueGetter: getTierName },
    {
      field: "col7",
      headerName: "QR",
      width: 50,
      filterable: false,
      sortable: false,
    },
  ];

  return (
    <div>
      <div style={{ height: 1024, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} rowsPerPageOptions={[25]} hideFooterSelectedRowCount={true}  />
      </div>
      <Link to="/studios/new">New studio</Link>
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
