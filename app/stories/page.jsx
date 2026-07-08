import EditorialImage from "@/components/EditorialImage";
import Footer from "@/components/Footer";
import { STORIES } from "@/lib/site-data";

export const metadata = {
  title: "Working Class Stories — Lorenzo von Barron Photography",
  description:
    "A documentary series — short interviews with car owners, tattoo artists, makers, fighters, chefs, trainers, and builders.",
};

export default function StoriesPage() {
  return (
    <main>
      <header className="page-header">
        <span className="eyebrow eyebrow--gold">Series</span>
        <h1 className="page-header__title">
          Working Class
          <br />
          <em>Stories</em>
        </h1>
        <p className="page-header__intro">
          Short interviews with interesting people — car owners, tattoo artists, makers, fighters,
          chefs, trainers, and builders. A conversation, a spread, and a look at the work they do.
        </p>
      </header>

      <section className="stories-list">
        {STORIES.map((story) => (
          <article className="story" key={story.num}>
            <div className="story__head reveal">
              <span className="story__num">{story.num}</span>
              <h2 className="story__name">{story.name}</h2>
              <span className="story__trade">{story.trade}</span>
            </div>
            <EditorialImage
              className="reveal-fade"
              src={story.image}
              label={story.label}
              alt={`${story.name}, ${story.trade} — Working Class Stories`}
            />
            <p className="story__pull">&ldquo;{story.pull}&rdquo;</p>
          </article>
        ))}
      </section>

      <Footer />
    </main>
  );
}
