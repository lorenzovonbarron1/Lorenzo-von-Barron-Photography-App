import EditorialImage from "@/components/EditorialImage";
import Footer from "@/components/Footer";
import { JOURNAL } from "@/lib/site-data";

export const metadata = {
  title: "The Journal — Lorenzo von Barron Photography",
  description:
    "Notes from behind the lens — process, obsessions, lessons, and the occasional strong opinion.",
};

export default function JournalPage() {
  return (
    <main>
      <header className="page-header">
        <span className="eyebrow eyebrow--gold">Journal</span>
        <h1 className="page-header__title">The Journal</h1>
        <p className="page-header__intro">
          Notes from behind the lens — process, obsessions, lessons, and the occasional strong
          opinion. Longer stories live under Working Class Stories.
        </p>
      </header>

      <section className="journal-grid">
        {JOURNAL.map((post) => (
          <article className="journal-card reveal-fade" key={post.title}>
            <EditorialImage src={post.image} label={post.label} alt={post.title} />
            <div className="journal-card__meta">
              <span className="journal-card__kicker">{post.kicker}</span>
              <span className="journal-card__date">{post.date}</span>
            </div>
            <h2 className="journal-card__title">{post.title}</h2>
            <p className="journal-card__excerpt">{post.excerpt}</p>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
