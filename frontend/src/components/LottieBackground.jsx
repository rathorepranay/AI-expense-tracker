import { useEffect, useState } from "react";

/**
 * Lottie Animation Background for Finance Theme
 * Lightweight, smooth, vector-based animations
 *
 * To use this:
 * 1. npm install lottie-web
 * 2. Add animation JSON files to public/animations/
 * 3. Get animations from: lottiefiles.com (search "money", "finance", "growth")
 */

export default function LottieBackground({ animationUrl = null }) {
  const [lottie, setLottie] = useState(null);
  const animationContainer = document.createElement("div");

  useEffect(() => {
    // Dynamically import lottie
    import("lottie-web").then((Lottie) => {
      setLottie(Lottie.default);

      if (animationUrl && Lottie.default) {
        const container = document.querySelector("#lottie-bg");
        if (container) {
          Lottie.default.loadAnimation({
            container: container,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: animationUrl,
          });
        }
      }
    });
  }, [animationUrl]);

  return (
    <div
      id="lottie-bg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}

/**
 * Recommended Lottie animations for money/finance theme:
 *
 * Download from lottiefiles.com:
 * - "Money Rain" (animated coins falling)
 * - "Piggy Bank Saving" (savings theme)
 * - "Stock Market" (financial growth)
 * - "Wallet" (payment/transactions)
 * - "Cryptocurrency" (digital money)
 * - "Coins Bounce" (interactive coins)
 *
 * Usage:
 * <LottieBackground animationUrl="/animations/money-rain.json" />
 */
