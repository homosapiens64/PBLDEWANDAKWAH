export type UserRole = "super_admin" | "admin" | "pengurus" | "bendahara" | "ustadz";
export type EducationInstitution = "adi" | "al-khawarizmi" | "ponpes-suruh";

export const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin Pendidikan",
  pengurus: "Pengurus",
  bendahara: "Bendahara",
  ustadz: "Ustadz",
};

export const roleHomePaths: Record<UserRole, string> = {
  super_admin: "/super-admin",
  admin: "/admin",
  pengurus: "/pengurus",
  bendahara: "/bendahara",
  ustadz: "/ustadz",
};

export const institutionLabels: Record<EducationInstitution, string> = {
  adi: "ADI",
  "al-khawarizmi": "Al Khawarizmi",
  "ponpes-suruh": "Ponpes Suruh",
};

export const educationInstitutions = Object.keys(
  institutionLabels,
) as EducationInstitution[];

export function isEducationInstitution(
  institution: string,
): institution is EducationInstitution {
  return educationInstitutions.includes(institution as EducationInstitution);
}
