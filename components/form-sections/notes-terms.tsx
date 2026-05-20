"use client";

import { useState } from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { Section, Field } from "@/components/ui/form-components";

export default function NotesTerms() {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const notes = useInvoiceStore((state) => state.notes);
  const setNotes = useInvoiceStore((state) => state.setNotes);

  return (
    <Section
      title="Notes & Terms"
      action={
        <button
          onClick={() => setIsEditingNotes(!isEditingNotes)}
          className="text-[9px] text-brand font-bold uppercase tracking-wider bg-brand-mid/10 px-2 py-1 rounded hover:bg-brand-mid/20 transition-colors cursor-pointer"
        >
          {isEditingNotes ? "Done" : "Edit"}
        </button>
      }
    >
      {isEditingNotes ? (
        <Field label="Instructions / Payment Terms">
          <textarea
            value={notes}
            rows={4}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-brand-mid/30 rounded-[5px] px-2.5 py-2 text-xs
              text-ink bg-surface font-[inherit] outline-none resize-y min-h-16 leading-relaxed
              focus:border-brand focus:ring-2 focus:ring-brand/15 transition-shadow
              md:px-2.5 md:py-2 md:text-xs px-3 py-2.5 text-sm"
          />
        </Field>
      ) : (
        <div className="text-xs text-ink-muted leading-relaxed whitespace-pre-line">
          {notes || <span className="italic text-ink-placeholder">No notes added.</span>}
        </div>
      )}
    </Section>
  );
}
