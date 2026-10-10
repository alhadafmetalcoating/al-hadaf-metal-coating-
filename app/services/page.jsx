import ServicePage from "@/views/Service";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/services");

export default function Page() {
  return <ServicePage />;
}
