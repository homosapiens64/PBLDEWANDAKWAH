import InlineContentEditor from "../components/InlineContentEditor";
import { getPublishedCertifiedUstadz } from "../lib/certified-ustadz";
import { getPublishedContentItems } from "../lib/content";
import KonsultasiClient from "./KonsultasiClient";

export default async function KonsultasiPage() {
  const [items, certifiedUstadz] = await Promise.all([
    getPublishedContentItems("konsultasi"),
    getPublishedCertifiedUstadz(),
  ]);

  return (
    <main className="page konsultasiPage">
      <KonsultasiClient certifiedUstadz={certifiedUstadz} items={items} />
      <InlineContentEditor items={items} module="konsultasi" section="jawaban" />
    </main>
  );
}
