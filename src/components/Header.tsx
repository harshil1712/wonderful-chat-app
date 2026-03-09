import { Surface } from "@cloudflare/kumo";

export default function Header() {
  return (
    <Surface
      as="header"
      className="border-b sticky top-0 z-10 animate-fade-in rounded-none"
      style={{
        backgroundColor: "var(--theme-bg-elevated)",
        borderColor: "var(--theme-border)",
        boxShadow: "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <div className="w-3 h-3 bg-white"></div>
          </div>
          <div className="flex flex-col">
            <h1
              className="text-xl font-bold uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--theme-text-primary)",
                letterSpacing: "0.05em",
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
