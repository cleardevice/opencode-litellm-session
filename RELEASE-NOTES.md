# Release Notes

## v1.0.0 (2026-07-02)

### Initial release

- First public release of `opencode-litellm-session`.
- Injects a LiteLLM session header (`x-litellm-session-id` by default) into every
  outbound LLM request via OpenCode's native `chat.headers` hook, so a LiteLLM
  proxy groups all turns of one OpenCode session into a single conversation.
- Options:
  - `header` — override the header name.
  - `providers` — restrict injection to a set of provider IDs (default: all).
- Single-file TypeScript plugin with zero runtime dependencies; loaded directly
  by OpenCode's Bun runtime. Type-checked against `@opencode-ai/plugin`.
