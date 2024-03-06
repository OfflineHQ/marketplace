export function KeySeparator({ separatorText }: { separatorText: string }) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-0.5 w-1/2 bg-border" />
      <div className="text-body mx-4 font-light">{separatorText}</div>
      <div className="h-0.5 w-1/2 bg-border" />
    </div>
  );
}
