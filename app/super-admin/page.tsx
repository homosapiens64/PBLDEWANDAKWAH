import RoleDashboard from "../components/RoleDashboard";

type SuperAdminPageProps = {
  searchParams: Promise<{
    education?: string | string[];
    finance?: string | string[];
    module?: string | string[];
    pmb?: string | string[];
    section?: string | string[];
  }>;
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SuperAdminPage({
  searchParams,
}: SuperAdminPageProps) {
  const params = await searchParams;

  return (
    <RoleDashboard
      role="super_admin"
      financeView={first(params.finance)}
      educationView={first(params.education)}
      pmbView={first(params.pmb)}
      moduleView={first(params.module)}
      sectionView={first(params.section)}
    />
  );
}
