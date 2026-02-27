"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Does 100% really go to families?",
    answer:
      "Yes. Every dollar you donate is delivered directly to the family you choose. There are no platform fees, no administrative overhead, and no middlemen. I cover all operating costs personally.",
  },
  {
    question: "How do you deliver the money?",
    answer:
      "I travel to Afghanistan and hand-deliver cash directly to families. You'll receive proof of delivery and can follow updates on our social media channels.",
  },
  {
    question: "How are families verified?",
    answer:
      "I meet every family in person. I verify their situation, film their stories with their permission, and create their profile myself. No one can add themselves to the platform.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer:
      "Currently, donations are not tax-deductible as we are operating as a direct giving initiative, not a registered nonprofit. We're exploring options for tax-deductible status in the future.",
  },
  {
    question: "Can I donate to a specific person?",
    answer:
      "Yes! That's the whole point. Browse profiles, find someone whose story moves you, and donate directly to them. You can also search by name or ID if you saw someone in one of our videos.",
  },
  {
    question: "What if I want a refund?",
    answer:
      "Because donations are delivered directly to families, they are generally non-refundable. If there's an issue with your donation, please reach out and we'll work with you.",
  },
  {
    question: "How do I know this is legitimate?",
    answer:
      "Full transparency is our foundation. You can follow my journey on social media, see the families I meet, watch the delivery videos, and track every donation. My name and face are on everything — I'm personally accountable.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border bg-card"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
