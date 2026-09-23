import { redirect } from "next/navigation";

/**
 * The bare domain root. Once admin auth exists (see README.md "Known gap:
 * admin auth"), this should check the session and send an unauthenticated
 * visitor to `/login` instead of straight to the console.
 */
export default function RootPage() {
  redirect("/dashboard");
}
