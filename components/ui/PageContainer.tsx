// components/ui/PageContainer.tsx
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={[
        "w-full max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto", // constrain + center
        className, // allow extra
      ].join(" ")}
    >
      {children}
    </div>
  );
}
