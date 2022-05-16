import type { ActionFunction } from "remix";
import { useActionData, redirect, json } from "remix";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { createStudio } from "~/studio";
import newStudioStyles from "~/styles/studios/new.css";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    name: string;
    email: string;
  };
};

export const links = () => {
  return [{ rel: "stylesheet", href: newStudioStyles }];
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const email = form.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const newStudio = await createStudio(request, { name, email });
  return redirect(`/studios/${newStudio.id}`);

  /*
  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
  */
};

export default function NewStudioRoute() {
  const actionData = useActionData<ActionData>();
  console.log("actionData", actionData);
  return (
    <div>
      <h2 className="title">Create new studio</h2>
      <form method="post">
        <div className="textFields">
          <div>
            <TextField
              type="text"
              label="Studio name"
              name="name"
              sx={{ width: "100%", maxWidth: 480 }}
            />
          </div>
          <div>
            <TextField
              type="email"
              label="Studio E-mail"
              helperText="OPTIONAL, can be left empty. Pick an info-email since this
              email can't be used for regular users later"
              name="email"
              sx={{ width: "100%", maxWidth: 480 }}
            />
          </div>
        </div>
        {/*}
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
            */}
        <div>
          <Button variant="contained" type="submit">
            Create studio
          </Button>
        </div>
      </form>
    </div>
  );
}
