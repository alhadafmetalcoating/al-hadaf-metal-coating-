import ContactForm from "@/views/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

export default function Page() {
  return <ContactForm />;
}
