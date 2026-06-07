import { PlaceholderPage } from "@/components/shell/placeholder-page"
import { APP_ROUTE_BY_KEY } from "@/lib/routes"

export default function Page() {
  return <PlaceholderPage route={APP_ROUTE_BY_KEY.digests} />
}
