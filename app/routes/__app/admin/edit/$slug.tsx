import { Form, json, useActionData, useTransition, useLoaderData, redirect } from "remix";
import type { ActionFunction } from "remix";

import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { Button } from "@mui/material";

import { getPost, createPost } from "~/post";

export const loader: LoaderFunction = async ({
  params,
}) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug));
};

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return json(errors);
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function PostSlug() {
  const post = useLoaderData();
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form key={post.slug} method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" defaultValue={post.title} />
        </label>
      </p>
      <p>
        Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
        <input type="text" name="slug" defaultValue={post.slug} />
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea id="markdown" rows={20} name="markdown" defaultValue={post.markdown} />
      </p>
      <p>
        <Button variant="contained" type="submit">
          {transition.submission ? "Editing..." : "Edit Post"}
        </Button>
      </p>
    </Form>
  );
}