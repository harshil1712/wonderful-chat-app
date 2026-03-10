import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/_public/sign-in")({ component: SignInPage });

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container auth-container">
          <Surface className="auth-card border border-black rounded-none animate-scale-in">
            <div className="auth-header">
              <p className="auth-eyebrow">Welcome Back</p>
              <h1 className="auth-title">Sign In</h1>
              <p className="auth-subtitle">Access your workspace and continue your latest conversations.</p>
            </div>

            <div className="auth-form">
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
                />
              </div>

              <div className="auth-meta-row">
                <Label htmlFor="remember-me" className="auth-check-row">
                  <Input id="remember-me" type="checkbox" className="auth-checkbox" />
                  <span>Remember me</span>
                </Label>
                <button type="button" className="auth-link auth-link-button">
                  Forgot password?
                </button>
              </div>

              <Button
                variant="primary"
                className="w-full rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold"
              >
                Sign In
              </Button>

              <div className="auth-footnote">
                <span>Need an account?</span>
                <Link to="/sign-up" className="auth-link">
                  Create one
                </Link>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
