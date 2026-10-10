import AboutUs from "@/views/AboutUs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

export default function Page() {
  return <AboutUs />;
}
