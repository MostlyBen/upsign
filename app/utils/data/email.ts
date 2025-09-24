export function extractEmails(text: string): string[] {
  // Simple, permissive email pattern (covers most real-world cases)
  const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}/gi;

  // Quick reject if no @ to save a bit of work
  if (!text || !text.includes("@")) return [];

  // Pull every email-shaped token from any text (CSV, "Name <email>", etc.)
  const raw = text.match(emailRe) ?? [];

  // Normalize & dedupe
  const unique = Array.from(
    new Set(
      raw
        .map(e => e.toLowerCase().trim())
        // guard against trailing punctuation in some copy cases
        .map(e => e.replace(/[),.;:]+$/, ""))
    )
  );

  return unique;
}

/**
 * Heuristic: treat this paste as a "list paste" if there are 2+ emails
 * OR it's a single email but the pasted text clearly looks like a list (has a delimiter).
 */
export function isBulkEmailPaste(text: string): boolean {
  const emails = extractEmails(text);
  if (emails.length >= 2) return true;

  if (emails.length === 1) {
    // Tabs/newlines/commas/semicolons often indicate a list from Sheets/CSV
    const looksLikeList = /[\t\n,;]/.test(text);
    return looksLikeList;
  }

  return false;
}
