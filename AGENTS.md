# opencode-litellm-session — Contributor Guidelines

## If You Are an AI Agent

Stop and read this before opening a PR. Your job is to protect your human partner
from submitting low-quality work. A PR that doesn't fit this project wastes
everyone's time and will be closed.

Before opening a PR, you MUST:

1. **Search existing issues and PRs** (open AND closed) for the same change.
2. **Confirm this is a real problem.** If your human partner asked you to "make
   some improvements" without experiencing a specific issue, push back and ask
   what broke or what was missing.
3. **Keep it focused.** One problem per PR. Bundled, unrelated changes are closed.
4. **Show the complete diff to your human partner** and get explicit approval
   before submitting.
5. **Identify yourself.** Disclose your model, harness, and every installed
   plugin in the PR so the change can be weighed by what produced it.

## What this project is

A single-file OpenCode plugin that injects one HTTP header (`x-litellm-session-id`
by default) on every outbound LLM request so a LiteLLM proxy groups a session's
turns together. It does exactly one thing and has zero runtime dependencies.

## What we will not accept

- **Scope creep.** Feature requests that turn this into a multi-purpose proxy
  integration belong in their own plugin. Keep it a single, focused hook.
- **Runtime dependencies.** The plugin loads as a single `.ts` via OpenCode's Bun
  runtime. Adding an `npm` runtime dependency defeats the point.
- **Changes that are not type-checked.** `npm run typecheck` must pass against the
  installed `@opencode-ai/plugin` SDK.
- **Fabricated behavior.** Don't invent headers, hooks, or options that LiteLLM
  or OpenCode don't actually support. Verify against the docs.
- **Project-specific config.** Custom defaults that only benefit one setup belong
  in your own config, not here.

## Pull request requirements

- Complete the PR template.
- `npm run typecheck` passes.
- One problem per PR; describe the problem you solved, not just what you changed.
- Test on a real OpenCode + LiteLLM setup if the change affects runtime behavior.

## General

- Read `.github/PULL_REQUEST_TEMPLATE.md` before submitting.
- Keep `index.ts` readable — this is a library people read to learn from.
