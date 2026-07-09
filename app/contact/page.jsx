import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact — Lorenzo von Barron Photography",
  description:
    "Let’s make something worth watching. Bookings via LYNK — every discipline routes to its own enquiry from the Portfolio.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="contact">
        <span className="eyebrow eyebrow--gold">Contact</span>
        <h1 className="contact__title">
          Let&rsquo;s make <em>something worth watching.</em>
        </h1>
        <div className="contact__grid">
          <div>
            <span className="contact__label">Bookings</span>
            <a href="/lynk/" className="contact__link">
              Book via LYNK →
            </a>
            <p className="contact__note">
              Every discipline routes to its own LYNK enquiry. Choose the frame, open the
              brief, and send the mission.
            </p>
          </div>
          <div>
            <span className="contact__label">Email</span>
            <a href="mailto:studio@lorenzovonbarron.com" className="contact__link">
              studio@lorenzovonbarron.com
            </a>
          </div>
          <div>
            <span className="contact__label">Social</span>
            <div className="contact__social">
              <a href="https://instagram.com" className="contact__link">
                Instagram
              </a>
              <a href="https://tiktok.com" className="contact__link">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer width="narrow" right="Lorenzo von Barron" />
    </main>
  );
}
