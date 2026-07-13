import Link from "next/link";

export default function Footer({ home = false, width = "wide", right = "Bookings via LYNK" }) {
  return (
    <footer className={`site-footer site-footer--${width}`}>
      {home ? (
        <span className="site-footer__left">Lorenzo von Barron</span>
      ) : (
        <Link href="/home/" className="site-footer__left">
          ← Home
        </Link>
      )}
      <span className="site-footer__right">{right}</span>
    </footer>
  );
}
