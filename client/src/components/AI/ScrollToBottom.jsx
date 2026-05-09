import { useEffect, useRef } from "react";

export default function ScrollToBottom({ children, dependency }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [dependency]);

  return (
    <>
      {children}
      <div ref={bottomRef} />
    </>
  );
}