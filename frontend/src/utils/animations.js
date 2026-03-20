// Reusable animation variants for Framer Motion

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export const scaleHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export const celebrationEmoji = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0, 0],
    y: [0, -30, -60]
  },
  transition: {
    duration: 1.5,
    animationPlayState: "ease-in-out"
  }
};

export const pulseScale = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1]
  },
  transition: {
    duration: 2,
    repeat: Infinity
  }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

export const slideOut = {
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
  transition: { duration: 0.3 }
};

export const popScale = {
  whileTap: { scale: 0.9 },
  animate: { scale: 1 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

export const shimmerAnimation = {
  animate: {
    backgroundPosition: ["0% 0%", "100% 0%"],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse"
  }
};

export const floatingEmoji = {
  animate: {
    y: [-20, -60],
    opacity: [1, 0],
    rotate: [0, 20]
  },
  transition: {
    duration: 2,
    ease: "easeOut"
  }
};

export const bounceAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 0.5,
    repeat: 2
  }
};

export const rotateHover = {
  whileHover: { rotate: 5 },
  transition: { type: "spring", stiffness: 300 }
};

export const glowEffect = {
  whileHover: {
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
  },
  transition: { duration: 0.3 }
};
