import { Shield, Eye, Handshake } from "lucide-react";

const points = [
  {
    icon: Shield,
    title: "No Platform Fees",
    description:
      "I cover all costs — hosting, payment processing, travel. Every cent you donate reaches the family.",
  },
  {
    icon: Eye,
    title: "Full Visibility",
    description:
      "Follow the journey on social media. See who you're helping, watch the delivery, get updates on their progress.",
  },
  {
    icon: Handshake,
    title: "Personal Accountability",
    description:
      "My name and face are on everything. No anonymous NGO — I'm personally responsible for every dollar.",
  },
];

export function TransparencySection() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            100% Goes to Families. Here&apos;s How.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Radical transparency is not a marketing claim — it&apos;s the entire model.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {points.map((point, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-6 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <point.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
