import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { site } from "@/data/site";

const title = "Admin Sign In | Hotstep Holdings Ltd";
const description = "Secure sign in for the Hotstep Holdings website management panel.";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSignIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    void navigate({ to: "/admin", replace: true });
  }

  async function onForgot(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage("Check your inbox for the reset link.");
  }

  return (
    <PageShell>
      <section className="bg-surface py-20">
        <div className="container-page max-w-md">
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            <img src={site.logo} alt="Hotstep Holdings Ltd" className="mx-auto mb-6 h-12 w-auto" />
            <h1 className="text-center text-2xl font-semibold">Management panel</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to manage the website." : "Reset your password."}
            </p>

            <form
              onSubmit={mode === "signin" ? onSignIn : onForgot}
              className="mt-6 space-y-4"
            >
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              {mode === "signin" && (
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-primary-dark">{message}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset link"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "forgot" : "signin");
                setError(null);
                setMessage(null);
              }}
              className="mt-4 w-full text-center text-xs font-medium text-muted-foreground hover:text-primary"
            >
              {mode === "signin" ? "Forgot your password?" : "Back to sign in"}
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
