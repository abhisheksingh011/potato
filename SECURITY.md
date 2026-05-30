# Security Policy

## Supported Versions

Potato is a single-file browser application with no backend, no server, and no runtime dependencies. The current version in `main` is the only supported version.

| Version | Supported |
|---------|-----------|
| Latest (`main`) | ✅ |
| Older commits | ❌ |

## Scope

Because Potato runs entirely in the browser from a local HTML file (or GitHub Pages), the attack surface is limited:

- **No server, no API, no database** — there is nothing to compromise remotely.
- **No user accounts, no authentication** — no credentials to steal.
- **No telemetry, no network calls** — the app never phones home.
- **Third-party LLM output** is pasted in by the user via AI Import; Potato sanitizes all user-controlled strings before inserting them into the DOM (see `escHtml()` in `index.html`).

The main realistic risk is a **cross-site scripting (XSS) vulnerability** in the diagram editor (e.g. unsanitized label/description injection into `innerHTML`) or in the **saved `.potato.html` viewer** (e.g. unsanitized playFlow narration).

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report privately via GitHub's built-in mechanism:

1. Go to **[Security → Report a vulnerability](https://github.com/abhisheksingh011/potato/security/advisories/new)** on this repository.
2. Describe the vulnerability, steps to reproduce, and potential impact.
3. We will acknowledge within **72 hours** and aim to release a fix within **14 days** for confirmed issues.

Alternatively, you can contact the maintainer directly via the email address on their [GitHub profile](https://github.com/abhisheksingh011).

## What to Include in a Report

- A clear description of the vulnerability
- Steps to reproduce (minimal test case if possible)
- The affected file(s) and line number(s) if known
- Potential impact (what an attacker could do)
- Any suggested fix (optional but appreciated)

## Out of Scope

The following are **not** considered security vulnerabilities for this project:

- Cost estimate or SLA data being inaccurate (see [NOTICE](NOTICE) — these are editorial summaries, not guarantees)
- LLM-generated diagram content being incorrect (user-supplied input)
- Missing HTTPS on local `file://` usage (browser behaviour, not Potato)
- Issues in third-party LLMs used with the AI Import feature

## Disclosure Policy

We follow **coordinated disclosure**: once a fix is shipped, we will credit the reporter (with their permission) in the release notes and close the advisory publicly.
