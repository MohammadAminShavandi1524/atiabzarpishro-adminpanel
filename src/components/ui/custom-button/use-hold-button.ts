import { useCallback, useEffect, useRef, useState } from "react";

import type { HoldHookReturn } from "./custom-button.types";

interface UseHoldOptions {
  duration?: number;

  onComplete?: () => void | Promise<void>;

  onHoldStart?: () => void;

  onHoldEnd?: () => void;

  onCancel?: () => void;

  autoReset?: boolean;
}

export function useHold({
  duration = 1200,

  onComplete,

  onHoldStart,

  onHoldEnd,

  onCancel,

  autoReset = true,
}: UseHoldOptions = {}): HoldHookReturn {
  const [progress, setProgress] = useState(0);

  const [holding, setHolding] = useState(false);

  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] = useState(false);

  const startTime = useRef<number | null>(null);

  const animationFrame = useRef<number | null>(null);

  const completedRef = useRef(false);

  const reset = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    startTime.current = null;

    setProgress(0);

    setHolding(false);

    setCompleted(false);

    completedRef.current = false;
  }, []);

  const stop = useCallback(() => {
    if (!holding) return;

    setHolding(false);

    if (progress < 100) {
      onCancel?.();

      reset();
    }

    onHoldEnd?.();
  }, [holding, progress, onCancel, onHoldEnd, reset]);

  const start = useCallback(() => {
    if (loading || completedRef.current) return;

    setHolding(true);

    setCompleted(false);

    startTime.current = performance.now();

    onHoldStart?.();

    const animate = (time: number) => {
      if (!startTime.current) return;

      const elapsed = time - startTime.current;

      const percentage = Math.min((elapsed / duration) * 100, 100);

      setProgress(percentage);

      if (percentage >= 100) {
        completedRef.current = true;

        setCompleted(true);

        setHolding(false);

        setLoading(true);

        Promise.resolve(onComplete?.()).finally(() => {
          setLoading(false);

          if (autoReset) {
            setTimeout(reset, 500);
          }
        });

        return;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
  }, [duration, loading, onComplete, onHoldStart, autoReset, reset]);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    progress,

    holding,

    loading,

    completed,

    start,

    stop,

    reset,
  };
}
