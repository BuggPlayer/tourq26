export default function PreviewBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface-elevated p-6 ${className}`}
    >
      {children}
    </div>
  );
}
