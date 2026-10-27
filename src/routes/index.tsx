import { Link, createFileRoute } from "@tanstack/react-router";
import { Button, Surface } from "@cloudflare/kumo";
import Header from "@/components/Header";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const features = [
    "Real-time streaming responses",
    "One interface for chat, vision, audio, and summaries",
    "Model selection with persistent preferences",
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden relative z-10">
        <div className="page-root">
          <div className="page-main">
            <div className="page-container landing-container">
              <section className="landing-hero animate-slide-up">
                <p className="landing-eyebrow">Core Interface</p>
                <h1 className="landing-title">Wonderful Chat</h1>
                <p className="landing-subtitle">
                  A focused AI workspace with a minimal visual system and fast model workflows.
                </p>
                <div className="landing-actions">
                  <Link to="/sign-up" className="block">
                    <Button
                      variant="primary"
                      className="w-full sm:w-auto rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/sign-in" className="block">
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white font-heading tracking-widest uppercase font-bold"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </section>

              <section className="landing-grid">
                {features.map((feature) => (
                  <Surface key={feature} className="landing-feature-card border border-black rounded-none animate-fade-in">
                    <p className="landing-feature-text">{feature}</p>
                  </Surface>
                ))}
              </section>

              <Surface className="landing-cta border border-black rounded-none animate-scale-in">
                <div className="landing-cta-content">
                  <div>
                    <p className="landing-eyebrow">Ready</p>
                    <h2 className="landing-cta-title">Open the Chat Workspace</h2>
                  </div>
                  <Link to="/chat">
                    <Button
                      variant="primary"
                      className="rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold"
                    >
                      Enter Chat
                    </Button>
                  </Link>
                </div>
              </Surface>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
