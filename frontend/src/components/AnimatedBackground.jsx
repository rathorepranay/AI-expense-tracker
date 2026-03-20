import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Background Video Component
 * Plays a finance/money themed video in the background
 * Supports fallback animations if video fails to load
 */
export default function AnimatedBackground({
  videoUrl = null,
  children,
  showFallback = true
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      {videoUrl && !hasError && (
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
      )}

      {/* Fallback: Animated Gradient Background */}
      {!videoUrl || hasError || !videoLoaded ? (
        <motion.div
          animate={{
            background: [
              "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)",
              "linear-gradient(135deg, #4facfe 0%, #667eea 25%, #764ba2 50%, #f093fb 75%, #4facfe 100%)",
              "linear-gradient(135deg, #f093fb 0%, #4facfe 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
          className="absolute inset-0 w-full h-full"
        />
      ) : null}

      {/* Overlay - Semi-transparent dark for readability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Animated Floating Money Icons (Overlay) */}
      {showFallback && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { emoji: "💰", delay: 0, duration: 6 },
            { emoji: "💵", delay: 1, duration: 7 },
            { emoji: "📈", delay: 2, duration: 8 },
            { emoji: "💳", delay: 1.5, duration: 7.5 },
            { emoji: "🏦", delay: 2.5, duration: 9 },
            { emoji: "💎", delay: 0.5, duration: 8.5 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                y: "100vh",
                x: `${Math.random() * 80 + 10}%`
              }}
              animate={{
                opacity: [0, 0.8, 0],
                y: "-100vh",
                rotate: [0, 360],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute text-6xl"
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
