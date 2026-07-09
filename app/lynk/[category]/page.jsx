import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PackageTile from "@/components/lynk/PackageTile";
import {
  LYNK_COPY,
  LYNK_CATEGORIES,
  categoryBySlug,
  packagesForCategory,
} from "@/lib/lynk-data";

export function generateStaticParams() {
  return LYNK_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.title} — LYNK · Lorenzo von Barron Photography`,
    description: `Book ${category.title} with Lorenzo von Barron Photography. ${category.tagline} Review the scope, see the pricing, and send the mission.`,
  };
}

export default async function LynkCategoryPage({ params }) {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const packages = packagesForCategory(slug);
  const categoryLabel = `${category.number} · ${category.title}`;

  return (
    <main>
      <section className="lynk-cat-header">
        <Link href="/lynk/" className="lynk-back">
          ← All Disciplines
        </Link>
        <span className="eyebrow eyebrow--gold">LYNK · {category.number}</span>
        <h1 className="lynk-cat-header__title">{category.title}</h1>
        <p className="lynk-cat-header__intro">{category.tagline}</p>
        {category.note && <p className="lynk-cat-header__note">{category.note}</p>}
      </section>

      <section className="lynk-packages">
        {packages.map((pkg) => (
          <PackageTile key={pkg.id} pkg={pkg} categoryLabel={categoryLabel} />
        ))}
      </section>

      <section className="lynk-cat-foot">
        <p className="lynk-cat-foot__line">{LYNK_COPY.budgetLineA}</p>
        <Link href="/lynk/" className="enquire-link">
          Browse every discipline <span>→</span>
        </Link>
      </section>

      <Footer width="narrow" right="LYNK · Booking Agent" />
    </main>
  );
}
