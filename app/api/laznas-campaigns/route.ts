import { NextResponse } from "next/server";

const laznasOrigin = "https://www.laznasdewandakwah.or.id";
const laznasCampaignSource = `${laznasOrigin}/jawa-tengah`;

type LaznasCampaign = {
  badge: string;
  href: string;
  id: string;
  image: string;
  org: string;
  progress: number;
  sisaWaktu: string;
  terkumpul: string;
  title: string;
};

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function stripTags(value: string) {
  return decodeHtml(value.replaceAll(/<script[\s\S]*?<\/script>/gi, " ").replaceAll(/<style[\s\S]*?<\/style>/gi, " ").replaceAll(/<[^>]+>/g, " "));
}

function absoluteUrl(value: string) {
  if (!value) return laznasCampaignSource;
  if (value.startsWith("http")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${laznasOrigin}${value}`;
  return `${laznasOrigin}/${value}`;
}

function rupiahToProgress(value: string) {
  const amount = Number(value.replace(/[^\d]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return 8;

  return Math.min(95, Math.max(10, Math.round(Math.log10(amount + 1) * 12)));
}

function parseCampaigns(html: string): LaznasCampaign[] {
  const campaigns: LaznasCampaign[] = [];
  const linkPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) && campaigns.length < 3) {
    const [, href, content] = match;
    const text = stripTags(content);

    if (!/Terkumpul/i.test(text) || !/Sisa Waktu/i.test(text)) continue;

    const imageMatch = content.match(/(?:src|data-src)=["']([^"']+)["']/i);
    const cleanText = text.replace(/^Urgent\s+/i, "");
    const title = decodeHtml(
      cleanText
        .split(/LAZNAS Dewan Dakwah/i)[0]
        .split(/Sisa Waktu/i)[0]
        .trim(),
    );
    const orgMatch = text.match(/(LAZNAS Dewan Dakwah(?:\s+[A-Za-zÀ-ÿ\s]+?)?)\s+Sisa Waktu/i);
    const timeMatch = text.match(/Sisa Waktu\s+(.+?)\s+Terkumpul/i);
    const amountMatch = text.match(/Terkumpul\s+(Rp\s*[\d.\s\u00a0]+)/i);

    if (!title || !amountMatch) continue;

    campaigns.push({
      badge: /^Urgent/i.test(text) ? "URGENT" : "OPEN DONASI",
      href: absoluteUrl(href),
      id: `laznas-${campaigns.length + 1}`,
      image: imageMatch ? absoluteUrl(imageMatch[1]) : "",
      org: decodeHtml(orgMatch?.[1] ?? "LAZNAS Dewan Dakwah Jawa Tengah"),
      progress: rupiahToProgress(amountMatch[1]),
      sisaWaktu: decodeHtml(timeMatch?.[1] ?? "~"),
      terkumpul: decodeHtml(amountMatch[1]),
      title,
    });
  }

  return campaigns;
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(laznasCampaignSource, {
      headers: {
        "user-agent": "Mozilla/5.0 DewanDakwahSemarang/1.0",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json({ campaigns: [] }, { status: 200 });
    }

    const html = await response.text();

    return NextResponse.json(
      { campaigns: parseCampaigns(html) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return NextResponse.json({ campaigns: [] }, { status: 200 });
  } finally {
    clearTimeout(timeout);
  }
}
