import { motion } from "framer-motion";

/**
 * Premium Button Component
 * Supports multiple variants with smooth animations
 */
export const PremiumButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg",
    secondary:
      "bg-white border-2 border-purple-300 text-gray-700 hover:bg-purple-50",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg",
    ghost: "text-purple-600 hover:bg-purple-50",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ⏳
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
};

/**
 * Premium Input Component
 * Smooth focus animations and validation states
 */
export const PremiumInput = ({
  label,
  error,
  icon,
  variant = "default",
  ...props
}) => {
  const variantClasses = {
    default:
      "border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200",
    alternative:
      "border-b-2 border-purple-300 focus:border-b-purple-500 bg-transparent",
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          {label}
        </label>
      )}

      <motion.div
        whileFocus={{ scale: 1.02 }}
        className="flex items-center"
      >
        {icon && <span className="mr-2 text-lg">{icon}</span>}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          className={`flex-1 px-4 py-2.5 rounded-lg focus:outline-none bg-white/80 backdrop-blur-sm transition ${variantClasses[variant]} ${
            error ? "border-red-500 ring-red-200" : ""
          }`}
          {...props}
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 mt-1 font-semibold"
        >
          ⚠️ {error}
        </motion.p>
      )}
    </div>
  );
};

/**
 * Premium Card Component
 * With hover lift effect and glass morphism
 */
export const PremiumCard = ({
  children,
  className = "",
  hoverable = true,
  gradient = true,
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${
        gradient
          ? "bg-gradient-to-br from-white via-purple-50 to-pink-50"
          : "bg-white"
      } backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Premium Badge Component
 * For status, tags, and labels
 */
export const PremiumBadge = ({
  children,
  variant = "primary",
  icon,
  animated = false,
}) => {
  const variantClasses = {
    primary: "bg-purple-100 text-purple-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <motion.span
      animate={animated ? { scale: [1, 1.05, 1] } : {}}
      transition={animated ? { duration: 2, repeat: Infinity } : {}}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${variantClasses[variant]}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.span>
  );
};

/**
 * Premium Loading Skeleton
 * Animated shimmer effect
 */
export const PremiumSkeleton = ({
  width = "w-full",
  height = "h-6",
  className = "",
}) => {
  return (
    <motion.div
      animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      className={`${width} ${height} ${className} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg`}
      style={{ backgroundSize: "200% 100%" }}
    />
  );
};