import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Reusable card
export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border shadow-lg p-[18px] min-w-0",
        dark
          ? "bg-gradient-to-b from-sidebar to-[hsl(220,20%,9%)] text-primary-foreground border-sidebar-border"
          : "bg-card border-line",
        className
      )}
    >
      {children}
    </div>
  );
}

// Tag/badge
export function Tag({ children, variant = "ok" }: { children: ReactNode; variant?: "ok" | "warn" | "info" | "danger" | "gray" }) {
  const styles: Record<string, string> = {
    ok: "bg-[hsl(151,81%,96%)] text-[hsl(162,73%,27%)]",
    warn: "bg-[hsl(48,100%,94%)] text-[hsl(28,80%,36%)]",
    info: "bg-[hsl(221,100%,96%)] text-[hsl(224,76%,48%)]",
    danger: "bg-[hsl(0,86%,97%)] text-[hsl(0,63%,42%)]",
    gray: "bg-[hsl(210,20%,96%)] text-[hsl(215,19%,35%)]",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap", styles[variant])}>
      {children}
    </span>
  );
}

// Panel title bar
export function PanelTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-[17px] font-bold m-0">{title}</h3>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

// Key-value row
export function KV({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5 border-b border-dashed border-line last:border-b-0 text-sm">
      <div className="text-soft">{label}</div>
      <div>{value}</div>
    </div>
  );
}

// Timeline item
export function TimelineItem({ title, desc, dark }: { title: string; desc: string; dark?: boolean }) {
  return (
    <div className={cn(
      "border rounded-[14px] p-3.5",
      dark ? "bg-white/[0.06] border-white/[0.08] text-primary-foreground" : "border-line bg-card"
    )}>
      <strong className="block mb-1 text-sm">{title}</strong>
      <small className={cn("text-xs leading-relaxed", dark ? "text-sidebar-foreground/70" : "text-soft")}>{desc}</small>
    </div>
  );
}

// Metric card content
export function MetricContent({ label, value, desc }: { label: string; value: string | number; desc: string }) {
  return (
    <div className="flex flex-col gap-2 min-h-[120px] justify-between">
      <div className="text-[13px] opacity-70">{label}</div>
      <div className="text-[30px] font-extrabold">{value}</div>
      <div className="text-[13px] opacity-60 leading-relaxed">{desc}</div>
    </div>
  );
}

// Button variants
export function Btn({ children, variant = "secondary", className, onClick }: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "ok";
  className?: string;
  onClick?: () => void;
}) {
  const styles: Record<string, string> = {
    primary: "bg-gradient-to-r from-[hsl(199,89%,49%)] to-[hsl(224,76%,48%)] text-primary-foreground shadow-[0_12px_28px_hsl(224_76%_48%/0.24)]",
    secondary: "bg-primary-foreground text-foreground border border-line",
    ghost: "bg-[hsl(217,100%,96%)] text-[hsl(224,76%,48%)] border border-[hsl(213,94%,87%)]",
    danger: "bg-[hsl(0,86%,97%)] text-[hsl(0,63%,31%)] border border-[hsl(0,93%,82%)]",
    ok: "bg-[hsl(151,81%,96%)] text-[hsl(162,73%,27%)] border border-[hsl(142,77%,73%)]",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-0 rounded-[14px] px-4 py-2.5 cursor-pointer font-bold transition-all duration-150 text-sm hover:-translate-y-px",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

// Table wrapper
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-auto border border-line rounded-2xl bg-card">
      {children}
    </div>
  );
}
