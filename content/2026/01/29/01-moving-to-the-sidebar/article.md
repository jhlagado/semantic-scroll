---
status: published
title: "Moving to the Sidebar"
summary: "The Debug80 panel started as a full-sized webview that competed for screen space with the editor. I migrated it to VS Code's sidebar using the WebviewView API which keeps the panel visible without stealing focus then allows per-session filtering through the activity bar."
tags:
  - debug80
  - vscode
  - webview
  - ui
  - sidebar
series: debug80diaries
---

# Moving to the Sidebar

By John Hardy

The original Debug80 panel was a standard webview that opened in an editor column. While that worked fine for focused debugging it fought for space whenever I needed to see both the source code plus the panel simultaneously. I would end up resizing constantly dragging the split bar back then forth as my attention shifted. The panel would steal focus when I did not want it to so the editor lost keyboard input until I clicked back. The sidebar seemed like a better home because it sits to the side of the editor by default while staying visible without demanding attention while using the familiar activity bar icon pattern that VS Code users already understand. I set out to migrate the panel from a plain webview to a WebviewView.

## The WebviewView Migration

A WebviewView is a webview that lives in the sidebar rather than an editor column though it can also live in the bottom panel. VS Code registers them through a viewContainer contribution in the extension manifest so the first step was declaring a new activity bar container with an icon then contributing a view inside that container. The view contribution specifies a factory function that creates the webview contents. The factory receives a WebviewView instance alongside a context object so I moved the existing rendering logic into that factory. The HTML plus JavaScript remained almost unchanged since the webview API is the same whether the webview lives in an editor column or the sidebar. I had to adjust the CSS layout because the sidebar width is narrower plus fixed so I switched from a multi-column layout to a single scrollable column.

## Activity Bar Integration

The activity bar icon gives users a persistent way to show or hide the panel. Clicking the icon reveals the sidebar with the Debug80 view selected which is the standard pattern for tools like the file explorer plus source control. I chose a simple debug-themed icon that matches the VS Code aesthetic. The icon supports a badge that shows a count so I wired it up to display the number of active breakpoints. This gives me a quick glance at the debugging state without opening the panel. The badge updates whenever breakpoints change through the webview messaging channel so the extension host does not need to poll which keeps the UI responsive even when the debugger sits paused at a breakpoint.

## Session-Aware Routing

With the panel in the sidebar I wanted it to automatically track the active debug session. If I have multiple sessions running simultaneously the panel shows the one I am currently interacting with. The extension listens for debug session changes then posts a message to the webview when the active session changes. The webview then requests state from the new session then updates its display. The routing also handles session termination gracefully since when a session ends the panel clears its display then shows a placeholder message inviting me to start a new session. This prevents the panel from showing stale data that might confuse me if I forgot which session I was looking at.

## Preserving State Across Sessions

A side effect of the sidebar placement is that the webview can persist across debug sessions which was not possible with the editor-column approach because closing the session closed the editor so the view state would reset every time. The sidebar view stays open so I added state serialization so the view remembers its scroll position alongside the collapse state of each section alongside any search or filter text. When I start a new session the view picks up where I left off. The serialization uses the webview state API rather than the extension's global state which scopes the data to the view instance plus avoids polluting the global namespace so each workspace can have its own view preferences.

## What This Enables

The sidebar placement integrates the panel seamlessly with VS Code rather than presenting an add-on that demands attention. I can keep it visible while editing code without the constant resizing dance. The activity bar icon provides a quick toggle when I do not need the panel. The badge keeps me informed without requiring me to open anything so I know at a glance how many breakpoints I have set. The session-aware routing means I do not have to think about which session the panel is showing because it follows my focus automatically. The preserved state means I can pick up where I left off even after restarting VS Code. These changes give the debugger an integrated appearance rather than a bolted-on afterthought. I find myself leaving the panel visible all the time now because it no longer obstructs my workflow.
