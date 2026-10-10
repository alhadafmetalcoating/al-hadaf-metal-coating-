import RAL3DCube from "@/Components/RalChart";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/ralchart");

export default function Page() {
  return <RAL3DCube />;
}
