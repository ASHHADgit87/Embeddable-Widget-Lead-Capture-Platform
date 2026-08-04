import { useEffect, useState } from "react";

interface NormalizedMouse {
  x: number;
  y: number;
}

export function useMousePosition(): NormalizedMouse {
  const [position, setPosition] = useState<NormalizedMouse>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setPosition({ x, y });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
}
