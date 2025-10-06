import { type PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type FadeInProps = PropsWithChildren<{
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  once?: boolean;
}>;

const FadeIn = ({
  children,
  delay = 0,
  duration = 0.6,
  y = 32,
  className,
  once = true,
}: FadeInProps) => {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : y,
      filter: prefersReducedMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  } as const;

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{
        delay,
        duration,
        ease: prefersReducedMotion ? "linear" : [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
