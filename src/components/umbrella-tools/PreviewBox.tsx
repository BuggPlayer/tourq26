export default function PreviewBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 ${className}`}
    >
      {children}
    </div>
  );
}
