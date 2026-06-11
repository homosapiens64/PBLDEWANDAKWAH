import RoleDashboard from "../components/RoleDashboard";

type BendaharaPageProps = {
  searchParams: Promise<{ finance?: string | string[] }>;
};

export default async function BendaharaPage({ searchParams }: BendaharaPageProps) {
  const finance = (await searchParams).finance;
  const financeView = Array.isArray(finance) ? finance[0] : finance;

  return <RoleDashboard role="bendahara" financeView={financeView} />;
}
