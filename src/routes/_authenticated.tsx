import { Outlet, createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-h-0 overflow-hidden relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
