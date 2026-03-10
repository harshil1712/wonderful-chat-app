import { Outlet, createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
