import { Link } from "remix";

export default function AdminIndex() {
  return (
    <>
      <p>
        <Link to="new">Create a New Post</Link>
      </p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </>
  );
}
