import RoleDashboard from "../components/RoleDashboard";

type PengurusPageProps = {
  searchParams: Promise<{
    education?: string | string[];
    educationMode?: string | string[];
    module?: string | string[];
    section?: string | string[];
  }>;
};

export default async function PengurusPage({ searchParams }: PengurusPageProps) {
  const params = await searchParams;
  const education = params.education;
  const educationMode = params.educationMode;
  const activeModule = params.module;
  const section = params.section;
  const educationView = Array.isArray(education) ? education[0] : education;
  const activeEducationMode = Array.isArray(educationMode) ? educationMode[0] : educationMode;
  const moduleView = Array.isArray(activeModule) ? activeModule[0] : activeModule;
  const sectionView = Array.isArray(section) ? section[0] : section;

  return (
    <RoleDashboard
      role="pengurus"
      educationView={educationView}
      educationMode={activeEducationMode}
      moduleView={moduleView}
      sectionView={sectionView}
    />
  );
}
