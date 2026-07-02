import Link from "next/link";
import { searchAll } from "../lib/search";
import { formatDate } from "../Berita/BeritaPublicView";
import SearchForm from "./SearchForm";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchAll(query) : [];

  return (
    <main className="searchPage container">
      <header className="searchPageHead">
        <h1>Pencarian</h1>
        <SearchForm initialQuery={query} />
        {query ? (
          <p className="searchPageMeta">
            {results.length > 0
              ? `Menemukan ${results.length} hasil untuk “${query}”.`
              : `Tidak ada hasil untuk “${query}”.`}
          </p>
        ) : (
          <p className="searchPageMeta">Ketik kata kunci untuk mencari berita, kajian, dan halaman.</p>
        )}
      </header>

      {results.length > 0 && (
        <ul className="searchResultList">
          {results.map((item) => (
            <li key={item.id} className="searchResultItem">
              <Link href={item.href} className="searchResultLink">
                <span className="searchResultType">{item.typeLabel}</span>
                <h2 className="searchResultTitle">{item.title}</h2>
                {item.summary && <p className="searchResultSummary">{item.summary}</p>}
                {item.publishedAt && (
                  <span className="searchResultDate">{formatDate(item.publishedAt, "short")}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {query && results.length === 0 && (
        <div className="searchEmpty">
          <p>Coba gunakan kata kunci yang berbeda atau lebih umum.</p>
        </div>
      )}
    </main>
  );
}
