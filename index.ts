import type { Plugin } from "@opencode-ai/plugin"

/**
 * opencode-litellm-session
 *
 * Injects a LiteLLM session header into every outbound LLM request so a
 * LiteLLM proxy groups all turns of one opencode session into a single
 * conversation (instead of recording one entry per request).
 *
 * It hooks into opencode's native `chat.headers` callback, which receives the
 * `sessionID` for each request and merges the returned headers into the actual
 * HTTP call to the provider. opencode's own built-in openai / github-copilot
 * providers set their HTTP headers through the same hook, so this reaches the
 * wire reliably.
 *
 * Options (passed via the config tuple form `["opencode-litellm-session", opts]`):
 *   - `header`     Header name to set. Defaults to `x-litellm-session-id`.
 *   - `providers`  Restrict injection to these provider IDs. Defaults to all.
 */

interface LiteLLMSessionOptions {
  header?: string
  providers?: string[]
}

const DEFAULT_HEADER = "x-litellm-session-id"

const LiteLLMSession: Plugin = async (_input, rawOptions) => {
  const options = (rawOptions ?? {}) as LiteLLMSessionOptions
  const { header = DEFAULT_HEADER, providers = [] } = options

  return {
    "chat.headers": async (input, output) => {
      if (providers.length && !providers.includes(input.model.providerID)) return
      output.headers[header] = input.sessionID
    },
  }
}

export default LiteLLMSession
export { LiteLLMSession }
