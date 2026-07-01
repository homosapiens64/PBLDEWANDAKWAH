import { getPublishedContentItems } from "../../lib/content";
import BeritaPublicView from "../BeritaPublicView";

export const dynamic = "force-dynamic";

export default async function BeritaKegiatanPage() {
  const items = await getPublishedContentItems("website");

  return <BeritaPublicView allItems={items} currentSection="kegiatan" />;
}
