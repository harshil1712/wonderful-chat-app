import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getSession } from "lib/auth.functions";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    try {
      const session = await getSession();
      if (!session) {
        throw redirect({ to: "/sign-in" });
      }
      return { session };
    } catch (error) {
      throw redirect({ to: "/sign-in" });
    }
  },
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
