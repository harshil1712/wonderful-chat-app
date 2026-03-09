import { MessageSquare } from "lucide-react";
import { Surface } from "@cloudflare/kumo";

export default function Header() {
  return (
    <Surface
      as="header"
      className="border-b sticky top-0 z-10 animate-fade-in"
      style={{
        backgroundColor: "var(--theme-bg-elevated)",
        borderColor: "var(--theme-border)",
        boxShadow: "var(--theme-shadow)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--theme-accent), var(--theme-accent-light))",
            }}
          >
            <MessageSquare size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "var(--theme-text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Wonderful Chat
            </h1>
          </div>
        </div>
      </div>
    </Surface>
  );
}
