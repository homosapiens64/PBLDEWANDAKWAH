import RoleDashboard from "../components/RoleDashboard";

type UstadzPageProps = {
  searchParams: Promise<{
    module?: string | string[];
    section?: string | string[];
  }>;
};

export default async function UstadzPage({ searchParams }: UstadzPageProps) {
  const params = await searchParams;
  const activeModule = params.module;
  const section = params.section;
  const moduleView = Array.isArray(activeModule) ? activeModule[0] : activeModule;
  const sectionView = Array.isArray(section) ? section[0] : section;

  return (
    <RoleDashboard
      role="ustadz"
      moduleView={moduleView}
      sectionView={sectionView}
    />
  );
}
