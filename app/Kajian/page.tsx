import InlineContentEditor from "../components/InlineContentEditor";
import { getPublishedContentItems } from "../lib/content";
import KajianClient from "./KajianClient";

export default async function KajianPage() {
  const items = await getPublishedContentItems("kajian");

  return (
    <>
      <KajianClient items={items} />
      <InlineContentEditor items={items} module="kajian" section="artikel-kajian" />
    </>
  );
}
