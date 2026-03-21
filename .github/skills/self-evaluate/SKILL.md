---
name: self-evaluate
description: "Self-evaluating skill that reviews and improves other skills after they are used. Automatically triggered after completing a task that involved a skill. Analyzes what worked, what was missing, and proposes concrete improvements to the used skill's SKILL.md."
user-invocable: true
---

# Self-Evaluate: Skill Improvement Loop

## Purpose

After completing a task that used one or more skills, run this skill to reflect on how well the skill instructions served the task. Identify gaps, ambiguities, or missing patterns — then apply improvements directly to the skill file.

## When to Trigger

Run this evaluation **after every task that used a skill**, either:

- Automatically as a final step of the task
- When the user explicitly asks to evaluate/improve skills

## Procedure

### 1. Identify the Used Skill(s)

Determine which skill(s) were loaded and followed during the just-completed task. Note the skill name and file path.

### 2. Reflect on the Task

Answer these questions honestly for each used skill:

- **Completeness**: Did the skill cover everything needed, or did I have to figure things out by reading code that the skill should have documented?
- **Accuracy**: Were any instructions outdated or wrong compared to the actual codebase?
- **Clarity**: Were any steps ambiguous or confusing? Did I have to make assumptions the skill should have resolved?
- **Missing patterns**: Did I discover new patterns, conventions, or gotchas during the task that future tasks would benefit from?
- **Unnecessary steps**: Were there instructions that didn't apply or added noise?
- **Order**: Was the recommended procedure order optimal, or did I naturally do things in a different sequence?

### 3. Gather Evidence

Before proposing changes, verify findings against the actual codebase:

- Read the current skill file
- Check if the patterns you want to add actually match the codebase conventions
- Look at recent code changes to see if conventions have evolved
- Confirm that any "missing" instruction is truly absent, not just in a reference file

### 4. Apply Improvements

Edit the skill's `SKILL.md` (or its reference files) with concrete, minimal changes:

- **Add** missing patterns, conventions, or edge cases discovered during the task
- **Update** outdated instructions to match current codebase reality
- **Clarify** ambiguous wording with specific examples
- **Remove** instructions that are demonstrably wrong or counterproductive
- **Reorder** steps if a better sequence was discovered

**Rules for changes:**

- Every change must be grounded in something that actually happened during the task
- Don't add speculative or hypothetical improvements
- Keep the same tone and format as the existing skill
- Prefer adding examples from the actual codebase over abstract descriptions
- Don't bloat the skill — if a section is getting long, consider moving details to a reference file

### 5. Log the Improvement

After applying changes, write a brief note to session memory (`/memories/session/skill-improvements.md`) recording:

- Which skill was improved
- What was changed and why
- The task that prompted the improvement

This creates an audit trail and helps avoid redundant evaluations.

## Example Improvements by Category

### Missing Pattern

> During player deletion, I discovered that the backend checks for related match appearances before allowing delete. The skill didn't mention dependency-check patterns for cascading deletes. Added a "Dependency Checks" section.

### Outdated Instruction

> The skill said to use `describe.sequential` for all integration tests, but the codebase has moved to per-test transaction rollback. Updated the integration test procedure.

### Ambiguous Step

> "Define constraints inline" didn't clarify whether CHECK constraints should go in the CREATE TABLE or as separate ALTER TABLE statements. Added clarification with an example from the existing migrations.

### Unnecessary Content

> The skill documented a `buildEntity()` helper pattern, but the codebase now uses a shared test factory. Removed the old pattern and referenced the factory.

## Quality Checklist

Before finishing, verify:

- [ ] Changes are factual (observed during the task, not theoretical)
- [ ] The skill file still reads coherently after edits
- [ ] No duplication introduced with existing content
- [ ] Examples use real code from the workspace, not made-up snippets
- [ ] The skill's YAML frontmatter description is still accurate
