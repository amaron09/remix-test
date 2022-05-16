import type { ActionFunction } from "@remix-run/{runtime}";
import { redirect } from "@remix-run/{runtime}";
import { Form } from "@remix-run/react";

import { createCompany } from "~/company";
import BreadCrumbs from "~/components/BreadCrumbs";

export const action: ActionFunction = async ({
  request,
}) => {
  const formData = await request.formData()
  const companyName = formData.get("companyName")

  const createCompanyResponse = await createCompany(request, {
    name: companyName,
  })
  console.log("companyName", createCompanyResponse)
  return null
}

export default function Create() {
  return (
    <div>
      <BreadCrumbs />
      <h2>Create new company</h2>

      <Form
        method="post"
        action="/companies/create?index"
      >
        <label>Company name</label>
        <input type="text" name="companyName" id="companyName" />

        <button type="submit">Create</button>
      </Form>
    </div>
  )
}