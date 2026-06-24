import InlineContentEditor from "../components/InlineContentEditor";
import { getPublishedContentItems } from "../lib/content";
import KonsultasiClient from "./KonsultasiClient";

export default async function KonsultasiPage() {
  const items = await getPublishedContentItems("konsultasi");

  return (
    <main className="page konsultasiPage">
      <KonsultasiClient items={items} />
      <InlineContentEditor items={items} module="konsultasi" section="jawaban" />
    </main>
  );
}
