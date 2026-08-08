import { Sidebar } from "./Sidebar";

export function DocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pr-2 pb-8">
            <Sidebar />
          </div>
        </aside>
        <article className="flex-1 min-w-0 prose-denim max-w-3xl">
          {children}
        </article>
      </div>
    </div>
  );
}
