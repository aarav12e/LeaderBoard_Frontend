import { useEffect, useState } from "react";

export function Counter({ value, visible, duration = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, visible, duration]);
  return <>{n.toLocaleString()}</>;
}
