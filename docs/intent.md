Here is the per‑article intentionality assessment and action plan. Each entry includes intent, audience, takeaway, and a concrete rewrite action or a rework flag.

Start Here: Building the Tool While Using It (article.md)
Intent: Onboard the reader into the experiment and declare that the build process itself is the content.
Audience: New readers who need a map of what this project is and why it is public.
Takeaway: This is a live system; the writing shapes the tooling and the tooling shapes the writing.
Rewrite action: Add a short paragraph at the end that explicitly tells readers how to use the archive (e.g. “start here, then follow the genesis series”), so the intent becomes an instruction, not just a declaration.

Why I’m Building This in Public (article.md)
Intent: Justify public work as a way to sharpen thought and bind decisions to visible code.
Audience: Readers sceptical about public diaries or AI‑assisted development.
Takeaway: Writing in public is not branding; it is the method that makes the system legible.
Rewrite action: Add one concrete example of a decision that changed because it was written down. This will make the motive feel real rather than abstract.

Writing Fast Without Writing Sloppily (article.md)
Intent: Defend speed as a requirement while showing how the author avoids formulaic prose.
Audience: Writers who assume speed and quality cannot coexist.
Takeaway: Fast writing is only useful when the system enforces attention rather than clichés.
Rewrite action: Add one short paragraph describing the specific failure mode the lint catches most often. That makes the intent practical and visible.

An Article Is a File (article.md)
Intent: Define the atomic unit of the system to keep it simple and durable.
Audience: Technical readers who need a precise model.
Takeaway: The file system is the source of truth, and the article is a stable unit.
Rewrite action: Add one sentence that explains why this matters to a reader (e.g. “this is why every permalink is durable and reviewable”), so the intent isn’t only structural.

The Article Body (article.md)
Intent: Protect the narrative surface from build logic and layout.
Audience: Anyone who expects Markdown to remain readable over time.
Takeaway: The body is the human record; templates are the mechanical frame.
Rewrite action: Add a short closing line that explicitly frames this as a commitment to readers, not just an implementation choice.

Assets (article.md)
Intent: Prevent media sprawl by coupling assets to their article.
Audience: Future maintainers and anyone adding images.
Takeaway: Assets are attachments to a file, not a global library.
Rewrite action: Add a sentence that ties this to portability (e.g. “a cloned repo remains complete”), reinforcing why the author cares.

Frontmatter as Data (article.md)
Intent: Keep index logic clean by separating machine data from prose.
Audience: Readers who need to understand the build pipeline.
Takeaway: Queries read frontmatter; prose remains human.
Rewrite action: Add a single sentence showing how this protects authorial voice (e.g. “the body stays readable even if the index logic changes”).

Series and Tags in Time (article.md)
Intent: Explain why the same data serves narrative order and topical order.
Audience: Readers navigating the archive.
Takeaway: Series are story‑order; tags are topic‑order.
Rewrite action: Add a closing line that tells the reader how to choose between the two, which makes the intent practical.

Indexing as Queries (article.md)
Intent: Enforce a declarative selection model and keep templates dumb.
Audience: Technical readers who might otherwise expect template logic.
Takeaway: Named queries are the only selection mechanism.
Rewrite action: Add a sentence that explains what this prevents (e.g. “no hidden selection, no surprise lists”), to make the author’s motive explicit.

A Blog That Is Also the Build System (article.md)
Intent: Frame the repo as both journal and tool.
Audience: Readers who need the conceptual hinge between philosophy and mechanics.
Takeaway: The system documents its own construction by existing in one place.
Rewrite action: Add a line that addresses the reader directly (“this is why you can inspect the system by reading the archive”), so intent is reader‑facing.

Blog Philosophy (article.md)
Intent: Anchor the project with non‑negotiable values.
Audience: Anyone trying to understand the project’s design boundaries.
Takeaway: Classic HTML, accessibility, and durable URLs are the baseline.
Rewrite action: Add a short sentence at the end that states the cost of violating the philosophy (e.g. “if I lose this, the project fails”), to make the intent feel binding.

Why Websites Need Templates (article.md)
Intent: Establish the basic problem templates solve before critique.
Audience: Readers unfamiliar with static publishing mechanics.
Takeaway: Templates reduce duplication and keep structure consistent.
Rewrite action: Add a closing line that ties this directly to the author’s system (“this is why I need a mechanical stamp”), to foreshadow the series payoff.

When Templates Start Making Decisions (article.md)
Intent: Show how logic inside templates erodes predictability.
Audience: Readers accustomed to template engines.
Takeaway: Selection logic inside templates becomes a hidden control plane.
Rewrite action: Add one sentence about the author’s reaction (“this is where I start losing trust in the output”), to make the motive personal and clear.

Templates as Mechanical Stamps (article.md)
Intent: Present the alternative template model and show it in action.
Audience: Readers ready for the concrete mechanism.
Takeaway: Templates are structural stamps; queries do selection.
Rewrite action: Add one sentence after the example stating what the author wants the reader to feel (“if you can read the template, you can understand the page”), to emphasise the reason for the design.

Owning Your Output (article.md)
Intent: Frame self‑publishing as a technical control decision.
Audience: Readers who use platforms out of convenience.
Takeaway: Owning the surface is about durability, not identity.
Rewrite action: Add a line that ties this back to the project (e.g. “this is why I build this system instead of posting elsewhere”), to make the connection explicit.

Reclaiming the Web’s Original Spirit (article.md)
Intent: Put the open‑web ethos in historical context.
Audience: Readers who may not remember or care about early web values.
Takeaway: The original contract of open protocols still matters.
Rewrite action: Add a closing sentence that bridges history to present action (“this is why I insist on open protocols in this system”), making intention explicit.

Your Address Is Your Domain (article.md)
Intent: Make the domain itself the core unit of independence.
Audience: Readers who think domain ownership is optional.
Takeaway: The URL is a promise, and owning it protects the promise.
Rewrite action: Add one line that states the author’s hoped‑for reader action (e.g. “I want you to own the address before you build the house”), which makes the intent directive.

Rework pile (if you want to prune rather than refine):
None of these need removal, but two are borderline if you want to cut aggressively for signal:

article.md (implementation‑heavy)
article.md (schema‑heavy)
If you want, I can implement the rewrite actions now, one article at a time, and keep a running checklist of intent clarity as we go.