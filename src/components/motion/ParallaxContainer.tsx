import { type PropsWithChildren, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type ParallaxContainerProps = PropsWithChildren<{
  className?: string;
  offset?: number;
  clamp?: boolean;
}>;

const ParallaxContainer = ({
  children,
  className,
  offset = 40,
  clamp = true,
}: ParallaxContainerProps) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const translateRange = prefersReducedMotion
    ? [0, 0]
    : clamp
      ? [offset, offset * -1]
      : [offset, offset * 1.35];
  const y = useTransform(scrollYProgress, [0, 1], translateRange);

  return (
    <motion.div ref={ref} className={cn("relative will-change-transform", className)} style={{ y }}>
      {children}
    </motion.div>
  );
};

export default ParallaxContainer;
