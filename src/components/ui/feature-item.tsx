interface FeatureItemProps {
  title?: string;
  children: React.ReactNode;
}

export function FeatureItem({ title, children }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="w-1.5 h-1.5 rounded-full bg-amber mt-2 flex-shrink-0" />
      <div>
        {title && <p className="font-medium text-ink text-sm mb-1">{title}</p>}
        <p className="text-ash text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
