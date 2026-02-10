---
status: published
title: "Killing 2,866 Lines of JavaScript-in-Strings"
summary: "When I looked at the webview code for Debug80, I found 2,866 lines of JavaScript embedded as template literals inside TypeScript files. I extracted them into proper TypeScript modules alongside HTML templates alongside CSS files. After adding esbuild bundling, the maintenance burden dropped considerably."
tags:
  - debug80
  - vscode
  - webview
  - refactoring
  - tooling
series: debug80diaries
---

# Killing 2,866 Lines of JavaScript-in-Strings

By John Hardy

The Debug80 extension uses VS Code webview panels to display hardware state. The TEC-1 panel shows seven-segment displays alongside the keypad with speaker activity. The TEC-1G panel adds an LCD character display with status LEDs. Both panels need JavaScript to handle message passing between the webview and the extension host. That JavaScript had accumulated inside TypeScript files as template literal strings, and it was making the codebase harder to maintain.

I counted the damage: 1453 lines in `ui-panel-html-script.ts` for TEC-1 plus 1413 lines in the corresponding TEC-1G file. Both files consisted almost entirely of a single exported function that returned a massive string containing mingled HTML with CSS with JavaScript. The pattern looked like this:

```typescript
export function getPanelScript(): string {
  return `
    <script>
      const vscode = acquireVsCodeApi();
      // ... 1,400 more lines
    </script>
  `;
}
```

The problems with this approach were immediate: the editor provided no syntax highlighting for the embedded code. Type checking on the JavaScript was absent while autocompletion failed to work while setting breakpoints was impossible. Every edit required careful attention to quote escaping and string interpolation boundaries. Refactoring tools could not see inside the strings. The files were technically TypeScript, but the interesting code was invisible to the toolchain.

## The extraction plan

I created a `webview/` directory at the project root. For each platform, there is a dedicated subdirectory: `webview/tec1/` and `webview/tec1g/`. Inside each platform folder, the structure is clear. The `index.html` file defines the layout and structure. The `styles.css` file handles presentation and visual details. The `index.ts` file manages behaviour and interactivity. To avoid duplication, a shared `webview/common/styles.css` holds styles used by both panels. This separation makes it easier to maintain and update each aspect of the webview independently.

The HTML files use placeholder tokens that the extension replaces at runtime. Each file is responsible for a specific function: structure, presentation, or interactivity. This division of responsibilities makes the codebase easier to navigate and reason about. Instead of treating structure, presentation, and interactivity as a single concern, the new approach gives each its own file and clear role. This makes the codebase more maintainable and easier to understand. The structure is now clear, and each responsibility stands on its own. Every section of the webview is now clearly defined and easy to locate.

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'none'; style-src {{cspSource}}; script-src 'nonce-{{nonce}}';"
/>
<link rel="stylesheet" href="{{commonStyleUri}}" />
<link rel="stylesheet" href="{{styleUri}}" />
<script nonce="{{nonce}}" src="{{scriptUri}}"></script>
```

The extension loads the template then substitutes the tokens with webview-safe URIs before serving the result. The TypeScript files compile to JavaScript through esbuild. The CSS files copy unchanged to the output directory.

## Setting up the build

I added a build script at `scripts/build-webview.js` that handles both platforms:

```javascript
const entryPoints = [
  path.join(webviewDir, "tec1", "index.ts"),
  path.join(webviewDir, "tec1g", "index.ts"),
];

await esbuild.build({
  entryPoints,
  outdir: outDir,
  outbase: webviewDir,
  bundle: true,
  platform: "browser",
  format: "iife",
  target: ["es2020"],
  sourcemap: true,
});
```

The `outbase` option preserves the directory structure so that `webview/tec1/index.ts` becomes `out/webview/tec1/index.js`. Static files (HTML and CSS) copy to matching locations. The extension resolver checks for compiled output first and falls back to source files during development.

## The HTML builder changes

The old `getTec1Html` function generated everything inline. The new version reads a template file and performs token substitution:

```typescript
function renderTemplate(
  template: string,
  replacements: Record<string, string>,
): string {
  return template.replace(/{{(\w+)}}/g, (match: string, key: string) => {
    return replacements[key] ?? match;
  });
}
```

The function resolves paths for both compiled and source directories so that the extension works during development without a build step. When the `out/webview/` directory exists, it serves compiled assets. Otherwise, it falls back to the source `webview/` directory. This fallback behaviour makes iterating on webview code faster because I can edit the TypeScript directly and reload the panel without running the build.

## What I gained

The webview TypeScript now has proper syntax highlighting and type checking. VS Code shows errors in the problems panel. Code completion and navigation to definitions both work properly. The separation of concerns is cleaner. HTML structure lives in HTML files. Styles live in CSS files. Behaviour lives in TypeScript files. This clear separation improves maintainability and helps new contributors understand the project faster. Each section of the webview is now easier to update and debug. The responsibilities are now distributed, not separated passively, making the codebase easier to maintain and less error-prone.

The total line count dropped from 2,866 to around 1,800 across the new files. This reduction happened partly because I removed duplicate code between the two platforms. Proper formatting without string escaping also takes fewer lines. The remaining code is easier to read and maintain. The codebase is now more approachable for future changes.

The build adds a step to the release process, but the tradeoff is worthwhile. Development-time feedback catches errors that previously hid inside opaque strings. The webview code is now a proper citizen of the TypeScript ecosystem. It is no longer an awkward guest.

## Lessons from the extraction

I should have structured the webview code this way from the start. The JavaScript-in-strings pattern emerged because I wanted to keep everything in one file during early prototyping. That convenience became a liability as the panels grew more complex. The refactoring cost was modest—a few hours of work—but it would have been cheaper to establish the pattern before the code reached 2,866 lines. This experience taught me the value of clear structure and early investment in maintainability.

The extraction pattern applies to any VS Code extension with non-trivial webview content. Template files with token substitution work alongside a bundler for TypeScript with a resolver that handles both development paths plus production paths. The structure scales to multiple webviews without duplicating the infrastructure code.
