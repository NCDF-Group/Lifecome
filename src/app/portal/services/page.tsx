import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/constants"

// Services are listed on Home, so this address has no page of its own
export default function ServicesPage() {
  redirect(ROUTES.PORTAL.DASHBOARD)
}
