import { getPublishedContentItems } from "../../lib/content";
import BeritaPublicView from "../BeritaPublicView";

export const dynamic = "force-dynamic";

export default async function BeritaInternasionalPage() {
  const items = await getPublishedContentItems("website");

  return <BeritaPublicView allItems={items} currentSection="internasional" />;
}
