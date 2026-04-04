interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  rotate?: [number, number];
  className?: string;
}

export function ParallaxLayer({ children, className }: ParallaxLayerProps) {
  return <div className={className}>{children}</div>;
}
