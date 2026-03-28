import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("ll-in"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-ll]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}