import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/_public/sign-up")({ component: SignUpPage });

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container auth-container">
          <Surface className="auth-card border border-black rounded-none animate-scale-in">
            <div className="auth-header">
              <p className="auth-eyebrow">Start Here</p>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Set up your account and unlock the full AI workspace.</p>
            </div>

            <div className="auth-form">
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
                  />
                </div>

                <div className="auth-field">
                  <Label htmlFor="sign-up-confirm-password" className="field-label">
                    Confirm
                  </Label>
                  <Input
                    id="sign-up-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    placeholder="Re-enter password"
                    className="auth-input"
                  />
                </div>
              </div>

              <Label htmlFor="terms" className="auth-check-row">
                <Input id="terms" type="checkbox" className="auth-checkbox" />
                <span>I agree to the terms and privacy policy.</span>
              </Label>

              <Button
                variant="primary"
                className="w-full rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold"
              >
                Create Account
              </Button>

              <div className="auth-footnote">
                <span>Already have an account?</span>
                <Link to="/sign-in" className="auth-link">
                  Sign in
                </Link>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
