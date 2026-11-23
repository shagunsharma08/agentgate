<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project architecture
- Keep the guided demo client-side and unchanged; live case proposals use a bounded server function on Lovable AI, while a pure TypeScript policy module alone assigns permissions, so model output cannot grant authority.
- Prototype execution records go through the deterministic execution gate: RED is human-only and blocked closure remains blocked even after approval; no trades, transfers, or emails are performed.
- Keep the eight fictional cases and golden grading in a client-safe domain module; evaluations run sequentially and pause remaining requests on credit, policy, auth, or rate-limit failures to avoid automatic inference replay.
- Define dashboard styling and semantic status colors in the global design system; use the shared Button for decisions and reset to keep interactions consistent.
- Intentionally omit global auth attachment for the public synthetic-only AI RPC, so published analysis does not depend on browser database configuration; future protected RPCs must attach bearer credentials and retain server-side authentication checks.
