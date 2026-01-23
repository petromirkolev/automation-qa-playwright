// Leading/trailing whitespace trimmed (“ London ” works)
// Empty input rejected (no API call, shows validation or no-op)
// Whitespace-only rejected
// Very long string rejected gracefully (no crash, shows error or validation)
// Special characters handled (e.g. “São Paulo”, “München”) – at least doesn’t crash
// Mixed-case input works (“lOnDoN”)

////

// Rapid consecutive searches: last search wins
// Type/search “London”, immediately search “Paris” → final UI shows Paris
// Slow network: loading indicator remains visible until results, then disappears (no “half-rendered” UI)
// Cancel/replace in-flight request (if your app effectively does this): older response must not overwrite newer results

////

// After invalid search, previous valid data should not remain as “current result” (stale data bug)
// Error message disappears after a successful search
// Loading indicator doesn’t get stuck after errors
// No duplicate result blocks created after multiple searches (results container updates, not appends infinitely)
