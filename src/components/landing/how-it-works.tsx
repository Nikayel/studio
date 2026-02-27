import { Camera, MousePointerClick, HandCoins } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "I Film Their Stories",
    description:
      "I travel to Afghanistan and meet families in person. I film their stories, verify their situations, and create profiles you can trust.",
  },
  {
    icon: MousePointerClick,
    title: "You Choose Who to Help",
    description:
      "Browse real profiles. Pick the person whose story moves you. Donate any amount — $25, $50, $100, or whatever you can give.",
  },
  {
    icon: HandCoins,
    title: "Cash Delivered Directly",
    description:
      "I hand-deliver 100% of your donation to the family. No fees, no overhead. You'll see proof of delivery and updates on their progress.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three simple steps. Zero complexity.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2 flex items-center justify-center">
                <span className="text-sm font-bold text-[hsl(var(--accent))]">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
