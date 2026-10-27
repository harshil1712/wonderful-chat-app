import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Label, Surface } from "@cloudflare/kumo";
import Header from "@/components/Header";
import { authClient } from "lib/auth-client";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/chat",
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
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
                  <p className="auth-eyebrow">Start Here</p>
                  <h1 className="auth-title">Create Account</h1>
                  <p className="auth-subtitle">
                    Set up your account and unlock the full AI workspace.
                  </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="auth-field">
                    <Label htmlFor="sign-up-name" className="field-label">
                      Full Name
                    </Label>
                    <Input
                      id="sign-up-name"
                      type="text"
                      value={name}
                      onValueChange={setName}
                      placeholder="Alex Morgan"
                      className="auth-input"
                      label="Full Name"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <Label htmlFor="sign-up-email" className="field-label">
                      Email
                    </Label>
                    <Input
                      id="sign-up-email"
                      type="email"
                      value={email}
                      onValueChange={setEmail}
                      placeholder="name@company.com"
                      className="auth-input"
                      label="Email"
                      required
                    />
                  </div>

                  <div className="auth-grid-2">
                    <div className="auth-field">
                      <Label htmlFor="sign-up-password" className="field-label">
                        Password
                      </Label>
                      <Input
                        id="sign-up-password"
                        type="password"
                        value={password}
                        onValueChange={setPassword}
                        placeholder="Minimum 8 characters"
                        className="auth-input"
                        label="Password"
                        required
                      />
                    </div>

                    <div className="auth-field">
                      <Label
                        htmlFor="sign-up-confirm-password"
                        className="field-label"
                      >
                        Confirm
                      </Label>
                      <Input
                        id="sign-up-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onValueChange={setConfirmPassword}
                        placeholder="Re-enter password"
                        className="auth-input"
                        label="Confirm Password"
                        required
                      />
                    </div>
                  </div>

                  <Label htmlFor="terms" className="auth-check-row">
                    <Input
                      id="terms"
                      type="checkbox"
                      className="auth-checkbox"
                      required
                    />
                    <span>I agree to the terms and privacy policy.</span>
                  </Label>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold disabled:opacity-50"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="auth-footnote">
                    <span>Already have an account?</span>
                    <Link to="/sign-in" className="auth-link">
                      Sign in
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
