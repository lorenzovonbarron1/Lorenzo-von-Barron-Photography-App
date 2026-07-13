import OrbitGateway from "@/components/OrbitGateway";

export const metadata = {
  title: "Lorenzo von Barron Photography",
  description:
    "Choose your experience — headshots, fitness, automotive, portraits, events, product, and Working Class Stories. Dark luxury editorial photography. Bookings via LYNK.",
};

// `/` is the LYNK Orbit Gateway — the site's entrance.
// The full homepage experience lives at /home.
export default function GatewayPage() {
  return <OrbitGateway />;
}
