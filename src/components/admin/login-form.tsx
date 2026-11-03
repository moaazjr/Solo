"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/form-field";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="mt-8 space-y-5">
      {state?.message && (
        <div role="alert" className="flex gap-2 rounded-md border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}
      <Field id="email" label="Email">
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClasses} />
      </Field>
      <Field id="password" label="Password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClasses} />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
