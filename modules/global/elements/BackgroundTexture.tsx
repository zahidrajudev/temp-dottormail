import clsx from "clsx";

type TextureVariant = "animatedNoise" | "darkNoise" | "glass" | "grid";

type Props = {
  variant?: TextureVariant;
  animate?: boolean;
  intensity?: "soft" | "medium" | "strong";
  className?: string;
  children?: React.ReactNode;
};

const noiseOpacity = {
  soft: "opacity-[0.04]",
  medium: "opacity-[0.07]",
  strong: "opacity-[0.12]",
};

export function BackgroundTexture({ variant = "animatedNoise", animate = true, intensity = "soft", className, children }: Props) {
  const config: any = {
    animatedNoise: {
      base: "bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20",
      animation: "animate-[gradientMove_12s_linear_infinite] bg-[length:200%_200%]",
      noise: true,
    },
    darkNoise: {
      base: "bg-gradient-to-b from-slate-900 to-slate-800",
      animation: "",
      noise: true,
    },
    glass: {
      base: "bg-white/5 backdrop-blur-xl",
      animation: "",
      noise: false,
    },
    grid: {
      base: "bg-slate-900",
      animation: "",
      noise: false,
      grid: true,
    },
  };

  return (
    <div className={clsx("relative overflow-hidden", config.base, animate && config.animation, className)}>
      {/* Grid texture */}
      {config.grid && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      )}

      {/* Noise overlay */}
      {config.noise && <div className={clsx("absolute inset-0 pointer-events-none bg-[url('/noise.png')]", noiseOpacity[intensity])} />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
