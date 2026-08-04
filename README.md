# Helix Shoes Header — Shopify Theme Design Specification

This repository is the research and implementation brief for rebuilding the Helix Shoes storefront header as a production Shopify theme section. It records the observed storefront behavior, the responsive design system, and the Liquid/CSS/JavaScript architecture needed to implement it.

The reference storefront was inspected at:

- <https://helix-shoes-theme.myshopify.com/>
- Storefront access used during inspection: the password supplied by the owner. The password is intentionally **not** stored in this repository.

## Repository status

This is a design-and-build specification, not a finished theme. The main deliverable is a detailed implementation prompt that a Shopify theme developer can use to build and verify the header. The repository is intentionally free of credentials, customer data, and copied storefront source code.

## GitHub delivery

- Repository: <https://github.com/edricnguyen-code/helix-shoes-theme-header>
- Working branch: [`feature/helix-header-design`](https://github.com/edricnguyen-code/helix-shoes-theme-header/tree/feature/helix-header-design)
- Visibility: public, so the design brief can be shared by URL.
- The working branch contains the README, the full design prompt, and the two validated schema examples. It was created from `main` and is kept separate so the implementation work can continue without changing the default branch.

## Demo preview

The `demo/` directory is a self-contained static preview of the documented header. It is intended for visual and interaction review before the Liquid section is wired into a Shopify theme. It includes:

- `demo/index.html` — semantic header, announcement bar, hero, responsive navigation, drawers, and preview content.
- `demo/styles.css` — responsive tokens and the desktop/tablet/mobile visual system.
- `demo/script.js` — announcement rotation, mega-menu, drawer, nested-menu, focus, Escape, scrim, and sticky-header behavior.
- `demo/helix-logo.svg` — image-based HELIX wordmark used in the header and mobile drawer.
- `demo/server.mjs` — a small no-build local server for checking the preview.

### August 4, 2026 visual-alignment revision

- Changed announcement rotation from horizontal movement to a vertical scroll-up transition.
- Replaced the text-built logo with a dedicated SVG image wordmark.
- Smoothed sticky-header morphing and scroll-direction hide/reveal motion.
- Changed Women and Men mega menus to open on pointer hover and keyboard focus; the chevron reverses while active.
- Made the desktop and tablet mega menus span the complete header width.
- Limited the mega-menu blur layer to content below the header and reduced its opacity/blur strength.
- Repositioned the action group and replaced the cart with a shopping-bag icon and a compact Vietnam currency selector.
- Kept desktop-style navigation through the tablet breakpoint; mobile navigation begins below 768px.
- Rebuilt the mobile navigation as a full-viewport, square-corner drawer with the reference login, locale, and social footer.
- Added separate Women editorial and Men deal submenu layouts; nested panels slide in from the right while the root menu exits left.

Run it from the repository root with:

```powershell
node demo/server.mjs
```

Then open <http://127.0.0.1:4173/>. Check the desktop mega-menu, search/account/cart drawers, announcement controls, scroll hide/reveal behavior, and the mobile menu by resizing the browser below the documented 992 px breakpoint. This preview is not a Shopify runtime: it does not render Liquid, connect to Shopify routes, or load store data.

## Deliverables

| File | Purpose |
| --- | --- |
| `README.md` | This project record: scope, evidence, architecture, tokens, behavior, accessibility, and acceptance criteria. |
| `docs/helix-header-implementation-prompt.md` | Full implementation prompt with the complete observation log, measurements, CSS behavior, Liquid schema, interaction states, and verification plan. |
| `examples/header-schema-validation.liquid` | Minimal, Theme Check-validated header section/schema example used to prove the settings and block model. |
| `examples/announcement-bar-schema-validation.liquid` | Minimal, Theme Check-validated announcement-bar section/schema example. |
| `demo/` | Runnable static preview for visual and interaction review of the documented header states. |

The local working copy also contains the original design document at `outputs/helix-header-implementation-prompt.md`.

## What was inspected

The storefront was opened with the supplied password and inspected using controlled viewport sizes and live DOM/CSS inspection. The following states were covered:

- Desktop: 1440 × 900 and 1280 × 800.
- Desktop/mobile layout switch: 991 px and 990 px.
- Tablet/mobile layout: 820 × 900.
- Tablet/mobile spacing switch: 768 px and 767 px.
- Mobile: 390 × 844.
- Homepage at the top and after scrolling.
- A collection page at the top.
- Announcement carousel, closed header, desktop sticky header, mobile hide/reveal sticky behavior.
- Mobile navigation drawer and the nested Women menu panel.
- Search drawer and empty cart drawer.
- Keyboard focus behavior, accessible names, focus outline, loaded stylesheet rules, keyframes, transition timing, z-index, and CSS custom properties.

## Evidence language

The full prompt separates certainty levels so implementation decisions remain traceable:

- **Observed** — measured or read directly from the rendered DOM, computed styles, stylesheet rules, or a reproducible interaction state.
- **Inferred** — derived from the live DOM/CSS when a final visual state could not be held open reliably (for example, the desktop mega-menu panel dimensions).
- **Recommended** — an intentional implementation improvement, especially for semantics, keyboard behavior, focus management, and maintainability.

## Reference visual system

### Global tokens

```css
:root {
  --color-bg: #ffffff;
  --color-ink: #1a1312;
  --color-lime: #d3f285;
  --color-focus: #0b61cd;
  --color-overlay: rgba(50, 50, 50, 0.50);
  --font-body: "Figtree", system-ui, sans-serif;
  --header-desktop-height: 80.39px;
  --header-mobile-height: 56px;
  --announcement-height: 38.39px;
  --desktop-inline-padding: 50px;
  --tablet-inline-padding: 30px;
  --mobile-inline-padding: 16px;
  --drawer-gap: 16px;
  --drawer-mobile-gap: 8px;
  --drawer-radius: 16px;
  --control-size-desktop: 44px;
  --control-size-mobile: 40px;
  --ease-sticky: cubic-bezier(0.625, 0.05, 0, 1);
  --ease-drawer: cubic-bezier(0.7, 0, 0.2, 1);
  --ease-mobile-sticky: cubic-bezier(0.6, 0, 0.4, 1);
}
```

These values are replication tokens. Keep them as CSS custom properties so a merchant can tune them without rewriting component rules.

### Typography

- Family: Figtree.
- Primary desktop navigation: 14 px, weight 500, line-height 22.4 px, letter-spacing 0.28 px.
- Announcement and supporting copy: 14 px, weight 400, line-height 22.4 px.
- Use the same metrics across desktop and mobile unless a component-specific rule says otherwise.
- Keep all visible copy in locale strings; do not hard-code English inside section markup.

### Breakpoints and dimensions

| Viewport | Layout | Header | Horizontal inset | Logo | Action target |
| --- | --- | ---: | ---: | ---: | ---: |
| ≥ 992 px | Desktop | 80.39 px | 50 px | 110 × 19 px | 44 × 44 px |
| 768–991 px | Mobile/tablet controls | 56 px | 30 px | 90 × 15.5 px | 40 × 40 px (use 44 px hit area where possible) |
| ≤ 767 px | Mobile controls | 56 px | 16 px | 90 × 15.5 px | 40 × 40 px (use 44 px hit area where possible) |

The exact layout switch is `@media (min-width: 992px)`. The inset changes at `768px`: tablet keeps 30 px; phones use 16 px.

## Header architecture to implement

Use a Shopify header section group with these responsibilities:

```text
sections/header-group.json
sections/announcement-bar.liquid
sections/header.liquid
snippets/header-logo.liquid
snippets/header-desktop-nav.liquid
snippets/header-mega-menu.liquid
snippets/header-actions.liquid
snippets/mobile-menu-drawer.liquid
snippets/search-drawer.liquid
snippets/cart-drawer.liquid
snippets/icon-*.liquid
locales/en.default.json
```

The header section should contain both desktop and mobile markup and expose only the active layout with CSS. Use Shopify routes (`routes.root_url`, `routes.search_url`, `routes.cart_url`, and `routes.account_url`) rather than hard-coded store URLs.

### Announcement bar

- Full-width, 38.39 px observed height; implement 38 px with ±1 px tolerance.
- Background `#D3F285`; foreground `#1A1312`.
- Two observed messages: free shipping over `5.000.000₫` and a 20% discount message.
- Centered content stage is approximately 700 px on desktop.
- Previous/next controls are 32 px wide, span the bar height, and use 24 px chevron icons.
- Autoplay interval observed at 5 seconds.
- Pause autoplay on hover, focus, reduced-motion preference, or when the page is hidden; expose an accessible live region and labelled controls.

### Desktop header

- Transparent over the homepage hero at the top of the page; dark ink controls are used on the reference light hero.
- Inner pages use a white surface.
- Content is horizontally padded by 50 px and vertically padded by 24 px.
- Center the 110 × 19 px logo; keep the primary navigation and actions in separate flex regions.
- Navigation labels use Figtree 14/500 with 0.28 px tracking.
- Search, account, and cart controls have 44 × 44 px targets and 24 px icons; currency is a compact VND selector.
- The sticky state becomes a white floating card with 16 px top offset, 50 px side insets, rounded corners, dark controls, subtle `0 1px 5px rgba(0,0,0,.1)` shadow, and the observed 0.5 s `cubic-bezier(.625,.05,0,1)` transition.

### Desktop navigation data

Top-level items observed:

- **Women** — quick links Top picks, Best sellers, Trending, New arrivals, On sale; activity links Hiking, Running, Training, Tennis, Lifestyle, Shop all; feature links Cushioned, Waterproof, Water-resistant, Breathable, Windproof; Women’s sale and Women’s favorites promotion cards.
- **Men** — the same quick/activity/feature groups plus five product feature cards: Prime form, Base line, Form core, Frame one, Drift prime.
- **Pages** — About us, Contact, Faqs, Store locations, Recently viewed, Our journal.

Build these as merchant-editable navigation/block data rather than hard-coded arrays. Top-level items with children need separate link and disclosure-button targets so the collection link remains reachable.

### Desktop mega-menu behavior

- Use a semantic disclosure pattern (`details/summary` only when the embedded-link interaction is not compromised, otherwise a button plus panel).
- The panel uses an open height/opacity transition of 0.3 s with `cubic-bezier(.6,.14,0,1)` and a maximum height of `85svh`.
- Items enter with the observed `opacity: 0; transform: translateY(15px)` to visible state over 0.4 s ease with approximately 0.15 s delay.
- The chevron rotates by `scaleY(-1)`.
- Link underlines animate from 0 to 100% over 0.2 s ease-in-out.
- The page scrim is `rgba(50,50,50,.5)` with approximately 20 px backdrop blur and a 0.3 s fade. Keep scrim below the panel and above page content.
- Close on Escape, outside click, route change, and selecting a leaf link. Restore focus to the disclosure button.

### Mobile/tablet header and drawer

- 56 px header with the 90 × 15.5 px logo.
- At 820 px the inset is 30 px; at 390 px it is 16 px.
- Use a menu button, centered logo link, and search/account/cart controls. Keep minimum 44 px accessible hit areas even when the visual icon box is 40 px.
- On scroll down, hide the header with `translateY(-110%)`; reveal it on scroll up using the observed 0.5 s `cubic-bezier(.6,0,.4,1)` transition. Respect `prefers-reduced-motion`.
- The navigation drawer is a fixed panel: 400 px wide with 16 px inset on tablet; approximately 374 px wide with 8 px inset on the 390 px phone; 16 px radius; overlay scrim with blur/dim.
- Drawer entry is `translateX(-100%) → 0` over 0.5 s `cubic-bezier(.7,0,.2,1)`. Nested Women content opens as a second panel with the same directional language and a visible Back control.
- Implement a native dialog-like focus model: `role="dialog"`, `aria-modal="true"`, labelled heading, focus trap, Escape close, scroll lock, and return focus to the opening control.

### Search, account, and cart drawers

- Desktop drawers are approximately 550 px wide, 16 px from the viewport edge, 16 px radius, with z-index 30 scrim / 31 drawer.
- Mobile drawers use the same approximately 374 × 828 px geometry with an 8 px inset on a 390 × 844 viewport.
- Search input: desktop approximately 484 × 48 px pill with 1 px border; mobile approximately 342 × 44 px.
- Account opens the account route on desktop; on mobile the drawer exposes Login/account actions.
- Cart drawer supports empty and populated states; the inspected reference was empty. Keep line-item updates, subtotal, checkout, and an empty-state message accessible.
- Drawers should share one reusable component contract for transitions, scrim, close button, focus management, and responsive sizing.

## Liquid section schema

The full prompt includes validated schema examples for `header.liquid` and `announcement-bar.liquid`. The schema should expose at least:

- Logo image, logo width, desktop/mobile insets, transparent-homepage toggle, sticky toggle, sticky mode, scroll threshold, and transition duration.
- Desktop and mobile navigation menu handles.
- Search/account/cart visibility and route behavior.
- Currency selector visibility and default currency label.
- Drawer width, radius, scrim opacity, backdrop blur, and animation duration.
- Announcement messages, links, autoplay interval, and pause-on-hover/focus.
- Merchant-editable promo cards and feature-product blocks for mega menus.

Use presets so a new theme install renders a complete header immediately. Validate the schema with Theme Check before committing theme code.

## Accessibility requirements

The reference had useful focus styling but several opportunities for improvement. The implementation must:

- Render a native `<header>` landmark and `<nav aria-label="Primary">`.
- Use semantic lists for navigation and descriptive accessible names for every icon-only control.
- Provide a visible skip link, keyboard-operable disclosures, Escape/outside-click close, and predictable focus return.
- Use `aria-expanded` and `aria-controls` on disclosure/menu buttons; mark the active route with `aria-current="page"`.
- Give drawers `role="dialog"`, `aria-modal="true"`, and an accessible heading/label.
- Trap focus while a drawer is open, lock page scroll, and prevent focus from remaining behind the scrim.
- Expose announcement updates through a polite live region without causing focus jumps.
- Keep the observed focus outline baseline: 2 px solid `#0B61CD`, 1 px offset; verify contrast on every background.
- Support `prefers-reduced-motion: reduce` by removing non-essential movement and autoplay.
- Ensure duplicate responsive logos have one `alt` text in the accessibility tree and decorative duplicates are hidden.

## Acceptance criteria

### Visual and responsive

- [ ] Desktop and mobile markup switch exactly at 992 px.
- [ ] Tablet uses 30 px inset and phones use 16 px inset below 768 px.
- [ ] Announcement bar, header, logo, action targets, drawer sizes, radius, colors, and typography meet the measured tolerances in the full prompt.
- [ ] Homepage transparent state, inner-page white state, desktop floating sticky card, and mobile hide/reveal sticky behavior match the documented states.
- [ ] Mega-menu groups, promotion cards, product feature cards, scrim, chevron, underline, and item entrance motion are present.
- [ ] Search, account, cart, currency, mobile menu, nested menu, and empty cart states are usable at every breakpoint.

### Behavior and accessibility

- [ ] Every disclosure works with mouse, touch, keyboard, and screen reader semantics.
- [ ] Escape, outside click, route change, and close buttons consistently close panels and restore focus.
- [ ] Drawer focus is trapped and page scroll is locked while open.
- [ ] Icon controls have labels, active routes have `aria-current`, and the announcement carousel has a polite live region.
- [ ] Reduced motion disables autoplay and non-essential transitions.
- [ ] No layout shift or horizontal overflow occurs at 390, 768, 820, 990, 991, 992, 1280, and 1440 px widths.

### Quality gates

- [ ] Theme Check passes for all Liquid/schema files.
- [ ] Keyboard-only and screen-reader smoke tests pass.
- [ ] Lighthouse/axe checks show no new header landmark, name, contrast, or focus violations.
- [ ] Browser snapshots at the listed viewport sizes are reviewed against the observed states.
- [ ] No storefront password, personal token, customer data, or browser session data is committed.

## Implementation workflow

1. Create the section group and snippets listed above.
2. Add locale keys and schema settings/blocks before wiring styling.
3. Implement the desktop structure and transparent/sticky states.
4. Implement mobile/tablet controls and drawer primitives.
5. Add mega-menu data rendering, scrim layering, and motion.
6. Add search, account, cart, currency, and announcement behavior.
7. Add focus management, reduced-motion behavior, and route-aware active states.
8. Run Theme Check, accessibility checks, and the viewport matrix in the acceptance criteria.
9. Capture before/after screenshots and record deviations from observed values in a changelog.

## Notes for future contributors

- Keep the full prompt as the source of truth for exact measurements and evidence notes.
- When a value changes, label the reason as observed, inferred, or recommended and update the acceptance checklist.
- Do not add the storefront password or personal GitHub credentials to commits.
- This repository is public by default so the work can be shared; change visibility in GitHub settings if the project later contains proprietary theme code.
