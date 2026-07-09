export const metadata = {
  title: "Offline — Lorenzo von Barron Photography",
  description: "You’re offline. The frame is still here — reconnect to load the full archive.",
};

// Served by the service worker when a navigation fails offline.
// Same black/serif/gold language as the rest of the site — minimal copy.
export default function OfflinePage() {
  return (
    <main>
      <section className="offline">
        <span className="eyebrow eyebrow--gold">Offline</span>
        <h1 className="offline__title">
          You&rsquo;re offline. <em>The frame is still here</em> — reconnect to load the full
          archive.
        </h1>
        <span className="offline__rule" aria-hidden="true" />
      </section>
    </main>
  );
}
