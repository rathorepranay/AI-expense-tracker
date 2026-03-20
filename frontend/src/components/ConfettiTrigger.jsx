import { useCallback } from "react";
import Confetti from "react-confetti";

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    // Create a temporary container for confetti
    const container = document.createElement("div");
    container.id = `confetti-${Date.now()}`;
    document.body.appendChild(container);

    // Use createRoot to render confetti
    const root = document.createRoot(container);

    // Render confetti
    root.render(
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={150}
        gravity={0.3}
        onConfettiComplete={() => {
          container.remove();
          root.unmount();
        }}
      />
    );
  }, []);

  return triggerConfetti;
};

// Simple confetti trigger component
export default function ConfettiComponent({ isActive = true }) {
  if (!isActive) return null;

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  );
}
