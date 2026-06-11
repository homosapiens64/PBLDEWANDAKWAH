import RoleDashboard from "../components/RoleDashboard";

type AdminPageProps = {
  searchParams: Promise<{
    education?: string | string[];
    educationMode?: string | string[];
    finance?: string | string[];
    module?: string | string[];
    section?: string | string[];
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const finance = params.finance;
  const education = params.education;
  const educationMode = params.educationMode;
  const activeModule = params.module;
  const section = params.section;
  const financeView = Array.isArray(finance) ? finance[0] : finance;
  const educationView = Array.isArray(education) ? education[0] : education;
  const activeEducationMode = Array.isArray(educationMode) ? educationMode[0] : educationMode;
  const moduleView = Array.isArray(activeModule) ? activeModule[0] : activeModule;
  const sectionView = Array.isArray(section) ? section[0] : section;

  return (
    <RoleDashboard
      role="admin"
      financeView={financeView}
      educationView={educationView}
      educationMode={activeEducationMode}
      moduleView={moduleView}
      sectionView={sectionView}
    />
  );
}
