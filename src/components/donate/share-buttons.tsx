"use client";

import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function ShareButtons() {
  const shareText = `I just donated to support Afghan girls' education through ${SITE_CONFIG.name}. 100% goes directly to families. Check it out:`;
  const shareUrl = SITE_CONFIG.url;

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({
        title: SITE_CONFIG.name,
        text: shareText,
        url: shareUrl,
      });
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      <Button variant="outline" size="sm" asChild>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
          Twitter / X
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={handleNativeShare}>
        Share
      </Button>
    </div>
  );
}
