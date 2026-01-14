# Core and Instance Separation Plan

This plan describes how to separate the publishing engine from any single blog without forcing a registry release cycle. The goal is to keep the blog’s templates, assets, CSS, client JavaScript, queries, and content owned by the instance, while the build and lint scripts remain a reusable engine. It also preserves the “clone and run” workflow that makes the system practical for less technical authors.

The plan assumes the current repository structure and explains a staged path forward. Each stage is designed to be reversible and additive so we do not lock ourselves into an irreversible release strategy.

## Background

Semantic Scroll now contains two different kinds of software. The engine is a set of scripts that render Markdown into HTML and produce feeds, indexes, and lint reports. The instance is the blog itself: templates, assets, CSS, client JavaScript, and the article tree. They are related, but they are not the same product, and the dependency relationship should be explicit.

The objective is to treat the engine as a coherent module without forcing a formal npm package release. We want a boundary that lets the instance evolve independently while still pulling engine updates when useful.

## Guiding Constraints

The instance owns its presentation and content. Templates, assets, CSS, client JS, and queries must stay inside the instance so the design is not centralised. The engine owns the scripts and defines a stable interface. The default workflow remains “clone, edit, run” and does not require a registry account, additional package managers, or external build services.

## Stage 1: Formalise the Boundary (No structural change)

The first step is to make the boundary explicit without changing the repository layout. The engine is everything in `scripts/` plus the default configuration. The instance is everything under `content/<contentDir>/`. `site-config.json` selects the instance. Templates resolve from the instance first, and assets and queries resolve from the instance as well.

This stage only requires documentation and minor cleanup. It gives authors a stable mental model and creates the foundation for future separation without disrupting current users.

## Stage 2: Optional Engine Extraction (Split without a registry)

If separation becomes a priority, the engine can move to a dedicated repository such as `semantic-scroll-engine`. The instance repository would carry only `content/<contentDir>/`, instance assets, templates, and site configuration. The engine repo would be pulled in using a simple upstream mechanism such as `git subtree` or a scripted vendor copy.

This keeps the release cycle informal. There is no npm publish step. Updates happen by pulling from an upstream repository when desired, which aligns with the current “fork and merge” approach.

## Stage 3: Monorepo Packages (Optional, still npm)

If a stronger dependency graph becomes useful, we can switch to npm workspaces inside a single repository. That would create `packages/engine` and `packages/prose-lint` with a `sites/semantic-scroll` instance. This is still one repo and uses npm only, but it adds multiple package manifests and a more explicit dependency graph.

This stage is optional and should be taken only if the dependency boundaries need to be enforced by tooling rather than by convention.

## Recommendation

Proceed with Stage 1 now. It clarifies the boundary, preserves the current workflow, and does not introduce new tooling. Keep Stage 2 as the next move if separation becomes necessary for upstream reuse. Stage 3 is only worth pursuing if we reach a point where shared tooling needs versioned internal packages and a formal dependency graph.

## Tutorial Implications

The setup tutorial should treat the engine as a dependency and the instance as the product. It should instruct new users to edit only their instance directory, and it should explain how to pull upstream engine updates without overwriting instance content or templates. The tutorial can mention that a future split may exist, but the default path should remain simple and local.
