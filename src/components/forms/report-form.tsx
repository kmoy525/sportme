"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { reportProfileAction } from "@/lib/actions/safety-actions";
import { REPORT_REASON_OPTIONS } from "@/lib/enums";
import { emptyFormState, fieldError } from "@/lib/form";

export function ReportForm({ profileId, name }: { profileId: string; name: string }) {
  const [state, action] = useActionState(reportProfileAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="profileId" value={profileId} />
      <FormError>{state.error}</FormError>

      <Field label="Reason" error={fieldError(state, "reason")}>
        <select name="reason" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select…
          </option>
          {REPORT_REASON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notes" hint="Optional.">
        <textarea
          name="notes"
          rows={4}
          maxLength={1000}
          placeholder={`Tell us what happened with ${name}.`}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input
          name="alsoBlock"
          type="checkbox"
          defaultChecked
          className="h-5 w-5 accent-[#ff6b35]"
        />
        Also block {name}
      </label>

      <SubmitButton variant="danger" size="lg" pendingLabel="Submitting…">
        Submit report
      </SubmitButton>
    </form>
  );
}
