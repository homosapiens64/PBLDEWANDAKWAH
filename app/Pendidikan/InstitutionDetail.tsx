import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Code,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Phone,
  Send,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ProgramIcon = "book" | "code" | "grad" | "home" | "message" | "mic" | "shield" | "star";

interface ProgramItem {
  title: string;
  description: string;
  badge: string;
  icon: ProgramIcon;
  tone: "green" | "gold" | "blue" | "purple";
}

export interface InstitutionDetailData {
  titleTop: string;
  titleAccent: string;
  description: string;
  imageUrl?: string;
  registration: string;
  capacity: string;
  level: string;
  vision?: string;
  requirements: string[];
  programs: ProgramItem[];
  admissionTitle: string;
  admissionDescription: string;
  contactTitle: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  registerHref: string;
}

const iconMap = {
  book: BookOpen,
  code: Code,
  grad: GraduationCap,
  home: Home,
  message: MessageCircle,
  mic: Mic,
  shield: ShieldCheck,
  star: Star,
} satisfies Record<ProgramIcon, LucideIcon>;

export default function InstitutionDetail({ data }: { data: InstitutionDetailData }) {
  return (
    <main className="institutionDetailPage">
      <section className="institutionHero">
        <div className="container institutionHeroInner">
          <h1>
            <span>{data.titleTop}</span>
            <strong>{data.titleAccent}</strong>
          </h1>
          <p>{data.description}</p>

          <div className="institutionMeta" aria-label="Informasi pendidikan">
            <span>
              <CalendarDays aria-hidden="true" />
              Pendaftaran: <strong>{data.registration}</strong>
            </span>
            <span>
              <Users aria-hidden="true" />
              Kapasitas: <strong>{data.capacity}</strong>
            </span>
            <span>
              <GraduationCap aria-hidden="true" />
              Jenjang: <strong>{data.level}</strong>
            </span>
          </div>

          {data.imageUrl ? (
            <div
              className="institutionHeroImage"
              style={{ backgroundImage: `url("${data.imageUrl.replaceAll('"', "%22")}")` }}
            >
              <span>{data.titleTop}</span>
            </div>
          ) : null}

          {data.vision ? (
            <div className="institutionVision">
              <span>Visi</span>
              <p>{data.vision}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="institutionRequirement">
        <div className="container institutionRequirementInner">
          <h2>Syarat Pendaftaran</h2>
          <ol>
            {data.requirements.map((requirement, index) => (
              <li key={requirement}>
                <span>{index + 1}</span>
                <p>{requirement}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="institutionPrograms">
        <div className="container">
          <h2>Program Pendidikan</h2>
          <div className="institutionProgramGrid">
            {data.programs.map((program) => {
              const Icon = iconMap[program.icon];

              return (
                <article className={`institutionProgramCard ${program.tone}`} key={program.title}>
                  <span className="institutionProgramIcon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <small>{program.badge}</small>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="institutionAction">
        <div className="container institutionActionGrid">
          <article className="institutionInfoCard">
            <h2>{data.admissionTitle}</h2>
            <p>{data.admissionDescription}</p>
            <div className="institutionButtonStack">
              <Link className="institutionPrimaryButton" href={data.registerHref}>
                <Send aria-hidden="true" />
                Daftar Sekarang
              </Link>
              <a className="institutionSecondaryButton" href="https://wa.me/6281234567890">
                <MessageCircle aria-hidden="true" />
                Info via WhatsApp
              </a>
            </div>
          </article>

          <article className="institutionInfoCard contact">
            <h2>{data.contactTitle}</h2>
            <dl>
              <div>
                <MapPin aria-hidden="true" />
                <dt>Alamat</dt>
                <dd>{data.contact.address}</dd>
              </div>
              <div>
                <Phone aria-hidden="true" />
                <dt>Telepon</dt>
                <dd>{data.contact.phone}</dd>
              </div>
              <div>
                <Mail aria-hidden="true" />
                <dt>Email</dt>
                <dd>{data.contact.email}</dd>
              </div>
              <div>
                <Clock aria-hidden="true" />
                <dt>Jam Operasional</dt>
                <dd>{data.contact.hours}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </main>
  );
}
