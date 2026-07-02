# opencode-litellm-session

An [OpenCode](https://opencode.ai) plugin that injects a **LiteLLM session header**
into every outbound LLM request, so a [LiteLLM proxy](https://docs.litellm.ai/docs/proxy/user_keys)
groups all turns of one OpenCode session into a single conversation — instead of
recording one entry per request.

## How it works

By default LiteLLM logs each API call as its own record. When OpenCode makes many
requests within a single coding session, the LiteLLM dashboard shows them as
unrelated calls. This plugin tags every request with the OpenCode `sessionID` so
LiteLLM stitches them into one logical conversation under the header of your
choice (`x-litellm-session-id` by default).

It hooks into OpenCode's native [`chat.headers`](https://opencode.ai/docs/plugins)
callback, which receives the `sessionID` for each request and merges the returned
headers into the actual HTTP call to the provider. OpenCode's own built-in
`openai` / `github-copilot` providers set their HTTP headers through the same
hook, so the header reliably reaches the wire.

> Works with any LiteLLM-compatible proxy (LiteLLM, Portkey, etc.) that groups by
> a request header.

## Installation

> **Important:** OpenCode does **not** support `git+https://` URLs in the `plugin`
> array. The `plugin` array accepts npm package names only. To install from GitHub,
> use one of the local methods below.

### From a local file (recommended)

The plugin is a single file with zero runtime dependencies. Copy `index.ts`
directly into your plugin directory — OpenCode auto-loads `.ts`/`.js` files from
these directories at startup, no config changes needed:

- `~/.config/opencode/plugins/` — global
- `.opencode/plugins/` — project-level

```bash
# Global install
curl -fsSL https://raw.githubusercontent.com/cleardevice/opencode-litellm-session/main/index.ts \
  -o ~/.config/opencode/plugins/opencode-litellm-session.ts
```

Or manually copy `index.ts` from this repo and rename it as you see fit.

### From npm (if published)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-litellm-session"]
}
```

OpenCode installs npm plugins automatically via Bun at startup.

### From a cloned repository

If you prefer to keep the full repo (e.g. for development or pinning a branch),
clone it into your plugin directory and add a wrapper file:

```bash
git clone https://github.com/cleardevice/opencode-litellm-session.git \
  ~/.config/opencode/plugins/opencode-litellm-session
```

Then create `~/.config/opencode/plugins/opencode-litellm-session.ts`:

```ts
export { default, LiteLLMSession } from './opencode-litellm-session/index.ts'
```

OpenCode scans the `plugins/` directory for `.ts`/`.js` files but does **not**
recurse into subdirectories, so the wrapper file is required.

To pin a specific version, checkout a tag inside the cloned repo:

```bash
git -C ~/.config/opencode/plugins/opencode-litellm-session checkout v1.0.0
```

## Usage

Zero configuration. Once loaded, every LLM request gets the header:

```
x-litellm-session-id: <opencode-session-id>
```

### Options

> Options via the config tuple form `[name, options]` are only supported for
> **npm-installed** plugins (see [OpenCode plugins docs](https://opencode.ai/docs/plugins)).
> For local installations, set options by editing the file directly.

**For npm-installed plugins**, pass options via the tuple form:

```json
{
  "plugin": [
    ["opencode-litellm-session", { "header": "x-session-key", "providers": ["litellm"] }]
  ]
}
```

**For local installations**, edit the defaults at the top of the file:

```ts
const DEFAULT_HEADER = "x-litellm-session-id"   // change this header name
const DEFAULT_PROVIDERS = []                      // restrict to these provider IDs
```

| Option      | Type       | Default                | Description                                            |
| ----------- | ---------- | ---------------------- | ------------------------------------------------------ |
| `header`    | `string`   | `x-litellm-session-id` | Name of the header injected on each request.           |
| `providers` | `string[]` | `[]` (all providers)   | Restrict injection to these provider IDs. Empty = all. |

## Requirements

- OpenCode with the `chat.headers` plugin hook.
- A LiteLLM proxy (or compatible gateway) that you point OpenCode at.

## Philosophy

- **Do one thing well** — inject one header, nothing else.
- **Zero runtime dependencies** — a single TypeScript file loaded directly by OpenCode's Bun runtime.
- **Evidence over claims** — type-checked against the real `@opencode-ai/plugin` SDK.

## Development

```bash
npm install      # install type definitions
npm run typecheck
```

The plugin is a single file (`index.ts`) loaded directly by OpenCode — no build step.

## Contributing

Issues and pull requests are welcome. Please read [AGENTS.md](./AGENTS.md) before
opening a PR, and target small, focused changes.

## License

MIT License — see [LICENSE](./LICENSE) for details.
