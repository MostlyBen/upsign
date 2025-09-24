import { ClipboardEvent, useCallback } from "react";
import { extractEmails, isBulkEmailPaste } from "~/utils/data/email";

type UseEmailPasteOptions = {
  onEmails: (emails: string[]) => void;
  allowSingleEmailIntercept?: boolean;
};

export default function useEmailPaste({ onEmails, allowSingleEmailIntercept = true }: UseEmailPasteOptions) {
  const onPaste = useCallback((e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text") || "";
    if (!text) return;

    const emails = extractEmails(text);
    const bulk = isBulkEmailPaste(text);

    if (bulk || (allowSingleEmailIntercept && emails.length === 1)) {
      e.preventDefault();
      if (emails.length > 0) onEmails(emails);
    }

  }, [onEmails, allowSingleEmailIntercept]);

  return { onPaste };
}
