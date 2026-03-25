export default function ToolHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{description}</p>
    </header>
  );
}
