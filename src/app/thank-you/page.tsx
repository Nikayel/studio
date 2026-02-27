import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowRight, Share2 } from "lucide-react";
import { ShareButtons } from "@/components/donate/share-buttons";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your donation. 100% will be hand-delivered.",
};

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(180,40%,56%)]/10">
            <Heart className="h-10 w-10 fill-[hsl(180,40%,56%)] text-[hsl(180,40%,56%)]" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-primary">
            Thank You!
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Your donation will be hand-delivered directly to the family.
            100% of what you gave reaches them.
          </p>

          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="flex items-center justify-center gap-2 font-semibold">
                <Share2 className="h-5 w-5" />
                Spread the Word
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Share this with your friends and family. Every share can change a
                life.
              </p>
              <ShareButtons />
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/profiles">
                Help Someone Else
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
