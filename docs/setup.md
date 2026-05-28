# Setup Guide

Full setup instructions for Brand OS. If the README covers what you need, you don't need this file — it's here for troubleshooting and edge cases.

---

## Notion MCP

Brand OS reads and writes to your Notion workspace via the Notion MCP. You need this connected before running brand-discovery.

### Claude Cowork (desktop app)

1. Open Settings → MCPs
2. Search for "Notion" and follow the prompts
3. Authorize with your Notion account

### Claude Code or other harnesses

Configure the MCP manually. A reference `.mcp.json` is included in the plugin package:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer YOUR_NOTION_API_KEY\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

Replace `YOUR_NOTION_API_KEY` with an integration token from [notion.so/my-integrations](https://www.notion.so/my-integrations).

Make sure the integration has access to your Brand OS database (share the database with the integration in Notion).

---

## Duplicating the Notion Template

→ [Brand OS template](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)

1. Open the link and press **Duplicate**
2. Notion adds it to your workspace as a private page
3. Open the Brand OS database, copy the URL
4. Extract the database ID — it's the segment after the last `/` and before `?`:

   ```
   notion.so/your-workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                             this is your database ID
   ```

5. Add it to your `CLAUDE.md`:

   ```
   Brand OS database ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## First Run

After installing the plugin and connecting Notion, run:

```
workspace-setup
```

This detects your environment, asks about your project structure, and scaffolds your workspace. At the end, it will prompt you to activate Brand OS.

Once setup is complete:

```
brand-discovery
```

This begins the 11-page brand interview. Sessions are stateful — if you stop mid-way, brand-discovery will resume exactly where you left off.

---

## Recommended Companion

[notion-attachment-urls-mcp](https://github.com/skip-group/notion-attachment-urls-mcp) — enables Brand OS to load Section Instructions directly from Notion attachment URLs. Not required, but significantly improves context loading.

---

## Troubleshooting

**"I can't find my database ID"**
Open your Brand OS database in Notion. The URL should look like: `notion.so/workspace/xxxxxxxx...`. The database ID is the 32-character hex string.

**"The agent can't connect to Notion"**
Check that your integration token is valid and that the Notion integration has been shared with the Brand OS database in Notion (Settings → Connections within the database).

**"brand-discovery is starting from the beginning again"**
This usually means the Notion Status field wasn't updated in your last session. Run brand-discovery and tell it which page you completed last — it will check Notion and resume from there.

**"I accidentally duplicated the template twice"**
Delete the extra one. Brand OS session lock (set at startup) prevents cross-database writes within a single session, so just confirm the correct database ID when prompted.
