import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Label, Surface } from "@cloudflare/kumo";
import Header from "@/components/Header";
import { authClient } from "lib/auth-client";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Failed to sign in");
      } else {
        navigate({ to: "/chat" });
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden relative z-10">
        <div className="page-root">
          <div className="page-main">
            <div className="page-container auth-container">
              <Surface className="auth-card border border-black rounded-none animate-scale-in">
                <div className="auth-header">
                  <p className="auth-eyebrow">Welcome Back</p>
                  <h1 className="auth-title">Sign In</h1>
                  <p className="auth-subtitle">
                    Access your workspace and continue your latest
                    conversations.
                  </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="auth-field">
                    <Label htmlFor="sign-in-email" className="field-label">
                      Email
                    </Label>
                    <Input
                      id="sign-in-email"
                      type="email"
                      value={email}
                      onValueChange={setEmail}
                      placeholder="name@company.com"
                      className="auth-input"
                      label="Email"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <Label htmlFor="sign-in-password" className="field-label">
                      Password
                    </Label>
                    <Input
                      id="sign-in-password"
                      type="password"
                      value={password}
                      onValueChange={setPassword}
                      placeholder="Enter your password"
                      className="auth-input"
                      label="Password"
                      required
                    />
                  </div>

                  <div className="auth-meta-row">
                    <Label htmlFor="remember-me" className="auth-check-row">
                      <Input
                        id="remember-me"
                        type="checkbox"
                        className="auth-checkbox"
                      />
                      <span>Remember me</span>
                    </Label>
                    <button
                      type="button"
                      className="auth-link auth-link-button"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold disabled:opacity-50"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="auth-footnote">
                    <span>Need an account?</span>
                    <Link to="/sign-up" className="auth-link">
                      Create one
                    </Link>
                  </div>
                </form>
              </Surface>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
