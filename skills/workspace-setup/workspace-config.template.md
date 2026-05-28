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
#   workspace-setup owns all writes. The Notes section is append-only — newest
#   entry first. Users may edit Notes freely; do not modify other sections
#   outside of the defined write points.
#
# SCHEMA VERSION: increment minor on additive changes, major on breaking changes.

schema_version: "1.0"
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
# Each module is a list — one entry per project instance that has the module activated.
# Activated in Phase 3. Connection config only.
# Content progress lives in the module's own system (e.g., Notion Status property for Brand OS).
#
# brand_os instance shape:
#   {project_id: "proj-N", status: "active", notion_db_id: "string", page_prefix: "string"}
#
# status values: inactive | setup | active

modules:
  brand_os: []
  linear: []
  figma: []

# ─── PERSONA ─────────────────────────────────────────────────────────────────
# Layer 2 persona. Optional — only written if workspace-setup runs the personality interview.
# If null, agent falls back to Layer 1 (plugin SOUL.md baseline).
# Written during Phase 2 when personality interview completes.
#
# When set, replace null with:
#   name: "string"
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
