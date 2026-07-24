import { Html, Line } from "@react-three/drei";

export function FeatureAnnotation({
  id,
  title,
  position,
  show,
}: {
  id: number;
  title: string;
  position: readonly [number, number, number];
  show: boolean;
}) {
  if (!show) return null;

  const lineEnd: [number, number, number] = [position[0] + 0.28, position[1], position[2]];

  return (
    <group>
      <Line points={[position, lineEnd]} color="#ffffff" lineWidth={1} transparent opacity={0.85} />
      <mesh position={position}>
        <sphereGeometry args={[0.012, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html position={lineEnd} center zIndexRange={[40, 0]} style={{ pointerEvents: "none" }}>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-lg">
            {id}
          </span>
          <span className="text-sm font-medium text-white drop-shadow-md">{title}</span>
        </div>
      </Html>
    </group>
  );
}
