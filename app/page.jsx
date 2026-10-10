import LandingPage from "@/views/LandingPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Page() {
  return <LandingPage />;
}
