import { notFound } from "next/navigation";
import PmbRegisterClient from "./PmbRegisterClient";

const institutionSlugs = ["adi", "al-khawarizmi", "ponpes-suruh"] as const;
type InstitutionSlug = typeof institutionSlugs[number];

function isInstitutionSlug(value: string): value is InstitutionSlug {
  return institutionSlugs.includes(value as InstitutionSlug);
}

export default async function PmbRegisterPage({
  params,
}: {
  params: Promise<{ institution: string }>;
}) {
  const { institution } = await params;

  if (!isInstitutionSlug(institution)) {
    notFound();
  }

  return <PmbRegisterClient institution={institution} />;
}
