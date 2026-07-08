import EditorialImage from "@/components/EditorialImage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Lorenzo von Barron Photography",
  description:
    "Photographer. Marketer. Veteran. Brand builder. Based in Arizona, shooting anywhere the story is worth telling.",
};

export default function AboutPage() {
  return (
    <main>
      <header className="page-header page-header--narrow">
        <span className="eyebrow eyebrow--gold">About</span>
        <h1 className="page-header__title">
          Lorenzo <em>von Barron</em>
        </h1>
      </header>

      <section className="reveal-fade">
        <EditorialImage
          className="about-portrait"
          src="/images/about/lorenzo-portrait.jpg"
          label="About — Portrait of Lorenzo"
          alt="Portrait of Lorenzo von Barron"
        />
      </section>

      <section className="about-prose">
        <p className="about-prose__lead">
          I&rsquo;m a photographer who cares less about equipment and more about how a person feels
          when they finally see themselves the way the room already sees them.
        </p>
        <p className="body-copy">
          The work spans headshots, fitness, automotive, weddings, events, product, students,
          families, and everything in between — but the through-line never changes: make people
          look important, make brands look expensive, make moments look legendary.
        </p>
        <p className="body-copy">
          Based in Arizona, shooting anywhere the story is worth telling. When I&rsquo;m not on a
          job, I&rsquo;m usually chasing one — the Working Class Stories series is where a lot of
          that ends up.
        </p>
        <p className="about-prose__cred">Photographer. Marketer. Veteran. Brand builder.</p>
      </section>

      <Footer width="narrow" />
    </main>
  );
}
