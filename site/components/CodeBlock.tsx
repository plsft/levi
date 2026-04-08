export function CodeBlock({
  title,
  lang,
  children,
}: {
  title?: string;
  lang?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="terminal my-6">
      <div className="terminal-header">
        <span className="terminal-dot bg-redtab-500/80" />
        <span className="terminal-dot bg-thread-400/80" />
        <span className="terminal-dot bg-wash-500/80" />
        {title && (
          <span className="ml-2 text-xs text-denim-400">{title}</span>
        )}
        {lang && (
          <span className="ml-auto text-xs text-denim-500">{lang}</span>
        )}
      </div>
      <div className="terminal-body">
        <pre className="text-sm leading-relaxed">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
