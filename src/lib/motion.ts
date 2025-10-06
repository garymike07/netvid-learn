export const easeEmphasized = [0.22, 1, 0.36, 1] as const;
export const easeEntrance = [0.16, 1, 0.3, 1.2] as const;
export const easeExit = [0.4, 0, 0.2, 1] as const;

export const defaultTransition = {
  duration: 0.6,
  ease: easeEmphasized,
};

export const viewportOnce = {
  once: true,
  amount: 0.35,
  margin: "-120px",
};

export const staggerChildren = (stagger = 0.08) => ({
  staggerChildren: stagger,
  delayChildren: stagger / 2,
});
