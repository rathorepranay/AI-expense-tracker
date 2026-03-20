import { motion } from "framer-motion";

const shimmerVariants = {
  animate: {
    backgroundPosition: ["0% 0%", "100% 0%"],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
  },
};

export function SkeletonCard() {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 p-6 rounded-2xl h-24"
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function SkeletonTable() {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className="space-y-3"
      style={{
        backgroundSize: "200% 100%",
      }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 h-12 rounded-lg"
        />
      ))}
    </motion.div>
  );
}

export function SkeletonChart() {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 p-6 rounded-2xl h-64"
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function SkeletonText({ width = "w-full", height = "h-4" }) {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded ${width} ${height}`}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function SkeletonAvatar() {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-12 h-12"
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
}
