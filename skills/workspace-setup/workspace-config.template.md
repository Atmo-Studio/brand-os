---
# workspace-config.md
# ─────────────────────────────────────────────────────────────────────────────
# THIS IS A TEMPLATE. Do not use this file as a live config.
# workspace-setup generates workspace-config.md at the workspace root by
# copying this structure and populating it with values gathered during setup.
# ─────────────────────────────────────────────────────────────────────────────
#
# READING THIS FILE (Phase 0):
#   Parse the YAML frontmatter. Extract setup_progress to determine routing,
#   projects for the welcome-back summary, persona for immediate activation,
#   and modules for Phase 3 context.
#
# WRITING THIS FILE:
#   workspace-setup owns the schema and the workspace/projects/setup_progress
#   sections. Module flows write their own blocks: the Brand OS storage step
#   (brand-discovery Step A or workspace-setup Phase 3) writes modules.brand_os,
#   agent-persona writes persona. Either may create a minimal config
#   (schema_version + their own block) if this file doesn't exist yet.
#   The Notes section is append-only — newest entry first. Users may edit Notes
#   freely; do not modify other sections outside of the defined write points.
#
# SCHEMA VERSION: increment minor on additive changes, major on breaking changes.

schema_version: "1.2"
created_at: null              # YYYY-MM-DD — set once at end of Phase 1; never updated
last_updated: null            # YYYY-MM-DD — updated after every write

# Initial setup type. Set once at end of Phase 1. Not updated on return visits.
# new-workspace: full Phase 1 architecture design + Phase 2 build
# project-folder: scoped setup for a single project only
workspace_entry: null         # new-workspace | project-folder

# ─── WORKSPACE ───────────────────────────────────────────────────────────────
# Written at end of Phase 1.

workspace:
  name: null                  # human-readable workspace name; used in Phase 0 greeting
  description: null           # one sentence confirmed during Phase 1; used in Phase 0 summary
  owner: null                 # user's name

# ─── PROJECTS ────────────────────────────────────────────────────────────────
# Populated at end of Phase 1 with all confirmed projects (instructions.written: false).
# Each project entry is updated at end of Phase 2 Step F when that project is built.
#
# Document entry shape: {name: "string", path: "relative/path", uploaded_at: "YYYY-MM-DD"}

projects: []

# Project entry template (add one per confirmed project):
#
# - id: "proj-N"               # sequential; used as foreign key in modules and setup_progress
#   name: null                 # confirmed project name
#   role: null                 # primary | secondary | archived
#   description: null          # one sentence; confirmed during Phase 1
#   instructions:
#     written: false           # set to true at end of Phase 2 Step D, after user confirms draft
#     path: null               # relative path to the written CLAUDE.md; set when written
#     last_updated: null       # YYYY-MM-DD; set when written
#   documents:
#     uploaded: []             # populated during Phase 2 Step E

# ─── MODULES ─────────────────────────────────────────────────────────────────
# Connection config only. Content progress lives in the knowledge base itself
# (the dimension Status values, wherever the brand is stored).
#
# brand_os is a LIST of instances — one per brand/project in the workspace, so a
# single workspace can run Brand OS for multiple brands at once. A solo founder
# has one entry; a studio or multi-brand workspace has several.
# Written and appended by the Brand OS storage step (brand-discovery Step A or
# workspace-setup Phase 3). Instance shape (schema v1.2):
#   - project_id: "proj-N"       # links to a projects[] entry; "default" if no projects defined
#     status: active             # active | setup | inactive
#     storage: notion            # notion | google-docs | md-folder  (NEW in v1.2)
#     notion_db_id: "string"     # locator — notion only
#     # drive_folder_id: "string"  # locator — google-docs only (Drive folder ID)
#     # path: "brand/"             # locator — md-folder only; always brand/ in the project folder, recorded for multi-brand resolution
#     page_prefix: "BRND"        # from storage-step customization
#     connected_at: "YYYY-MM-DD"
#
# BACK-COMPAT (v1.1 → v1.2): an entry with notion_db_id and no storage field is
# storage: notion. Readers must apply this rule; existing configs need no edits.
#
# Reader rule: distinct brands are distinct entries with their own storage +
# locator and knowledge base — never shared. Brands are separated by project
# FOLDER, so resolve by scope: match the brand_os entry whose project_id is the
# project folder the session is operating in, and use only that entry's
# knowledge base. If the workspace has one entry, use it. Only if scope is
# genuinely ambiguous (no clear project folder, several active) ask the user
# which brand the session is for.
#
# linear and figma are future modules (list of instances, shape TBD when built).

modules:
  brand_os: []
  linear: []
  figma: []

# ─── PERSONA ─────────────────────────────────────────────────────────────────
# Layer 2 persona. Optional — written by the agent-persona skill (invoked
# directly or from workspace-setup Phase 3). If null, agent falls back to
# Layer 1 (plugin SOUL.md baseline).
#
# When set, replace null with:
#   name: "string"               # agent name, or "unnamed" if skipped
#   archetype: "string"          # Strategist | Collaborator | Operator | Mentor
#   path: "relative/path/to/persona-file.md"   # relative to workspace root
#   created_at: "YYYY-MM-DD"
#   layer: 2

persona: null

# ─── SETUP PROGRESS ──────────────────────────────────────────────────────────
# Tracks workspace-setup's own phase completion state.
# Read in Phase 0 to determine routing. Updated after each phase completes.
# Do not modify manually.
#
# Detection logic (evaluated in order):
#   1. phase_1_architecture.complete: false → resume Phase 1
#   2. phase_1_architecture.complete: true AND phase_2_build_loop.complete: false
#      → resume Phase 2 at setup_progress.phase_2_build_loop.resume_at
#   3. All phases complete → full workspace; open with summary and ask what to do

setup_progress:
  phase_1_architecture:
    complete: false
    completed_at: null          # YYYY-MM-DD

  phase_2_build_loop:
    complete: false
    projects_complete: []       # project IDs — appended at end of each Phase 2 Step F
    projects_remaining: []      # project IDs — set at end of Phase 1; depleted through Phase 2
    resume_at: null             # project ID to start at next session; null when phase_2 complete

  phase_3_modules:
    complete: false
    modules_activated: []       # module names (e.g., brand_os)
    modules_pending: []         # modules user flagged interest in but hasn't activated yet
---

## Notes

<!-- workspace-setup appends here at the end of each phase write. Newest entry first. User may edit freely. -->
