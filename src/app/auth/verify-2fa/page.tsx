import { redirect } from "next/navigation"

export default function VerifyTwoFactorPage() {
  redirect("/auth/login")
}
