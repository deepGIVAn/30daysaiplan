interface SectionHeadingProps {
  title: string;
  detail?: string;
}

export function SectionHeading({ title, detail }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-[17px] font-semibold text-foreground">{title}</h2>
      {detail && (
        <span className="shrink-0 text-fine tabular-nums text-muted-foreground">{detail}</span>
      )}
    </div>
  );
}

export function SectionRule() {
  return <div className="h-px w-full bg-border" />;
}
