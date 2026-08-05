# Helix Shoes Header — Shopify Theme Design Specification

This repository contains a complete, installable Shopify Online Store 2.0 theme shell focused on rebuilding the Helix Shoes storefront header. It includes the original evidence-based design specification, a standalone browser demo, and production Liquid/CSS/JavaScript connected to Shopify navigation, localization, predictive search, customer, product, and cart data.

The reference storefront was inspected at:

- <https://helix-shoes-theme.myshopify.com/>
- Storefront access used during inspection: the password supplied by the owner. The password is intentionally **not** stored in this repository.

## Repository status

The Shopify conversion is implemented on `feature/helix-header-design`. The repository is intentionally free of storefront passwords, access tokens, customer data, and copied storefront source code. Merchant content and images are supplied through Shopify’s navigation and theme editor instead of being hardcoded.

## GitHub delivery

- Repository: <https://github.com/edricnguyen-code/helix-shoes-theme-header>
- Working branch: [`feature/helix-header-design`](https://github.com/edricnguyen-code/helix-shoes-theme-header/tree/feature/helix-header-design)
- Visibility: public, so the design brief can be shared by URL.
- The working branch contains the installable theme, production header and announcement sections, static demo, full design prompt, and validation examples. It remains separate from `main` for review.

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
- Kept desktop-style navigation at 991 px and wider at that revision; the August 5 responsive correction below supersedes this boundary.
- Rebuilt the mobile navigation with the reference login, locale, and social footer; the August 5 responsive correction below supersedes the earlier full-viewport geometry.
- Added separate Women editorial and Men deal submenu layouts; nested panels slide in from the right while the root menu exits left.

### August 4, 2026 submenu follow-up

- Added a top-down white header surface whenever a desktop mega menu or the currency selector is active at the top of the page; the header remains full viewport width in this state.
- Rebuilt Women and Men as single text-and-chevron triggers so their underline and arrow reversal share the same `300ms` easing and activate together across the full control.
- Added a hover/focus currency submenu with Vietnamese dong and US dollar preview rows.
- Hardened mobile submenu switching with an explicit `data-active-nested` state in addition to the animated panel class.
- Added an on-screen mobile instruction and submenu preview labels so the nested transition and populated layouts are immediately checkable.

### August 4, 2026 announcement motion refinement

- Changed announcement messages to use explicit enter/leave states so every direction change still brings the next message from the bottom upward.
- Added a shared cubic-bezier ease-in-out curve for the vertical travel and a synchronized opacity fade for outgoing/incoming messages.
- Made the loop deterministic with a queued transition state so rapid clicks and timer ticks cannot interrupt or reverse the bottom-up direction.
- Updated the announcement copy to match the reference: “Free shipping for all orders over 5.000.000₫” with a bold price, plus “Receive 20% off your first order. Shop now” with an underlined Shop now link.
- Preserved the reduced-motion override so the announcement remains static for users who request less motion.

### August 4, 2026 Shopify menu parity revision

- Added a normal typographic gap before both the bold shipping threshold and the underlined “Shop now” link without changing the announcement copy or vertical motion.
- Removed the route-current selector from the top-navigation underline animation. A label is now underlined only during hover, keyboard focus, or an open menu; the chevron reverses on the same state and timing while the line remains beneath the text only.
- Made every Shopify top-level link with children render through the full-width mega-menu component. A matching mega-menu block is now optional and adds featured promotions/products instead of deciding whether the full-width layout exists.
- Replaced the sticky direction check with the demo’s accumulated scroll-intent thresholds. The header morphs into the floating card after 28 px, hides after sustained downward travel, and reveals after deliberate upward travel without flickering on small wheel/touch deltas.
- This revision temporarily used a 991/990 px layout boundary. The August 5 responsive correction below supersedes it with a compact tablet header from 768 px upward.
- Made mobile and tablet parent rows full-width disclosure buttons. Level two and level three panels both enter from the right while their parent exits left; the destination for each parent remains available from the nested panel heading.
- Matched the mobile drawer’s 64 px header, 59 px drawer logo, 20 px navigation inset, 42 px login control, 47 px localization row, and 53 px social row. Facebook, Instagram, YouTube, and TikTok circles remain visible as non-interactive placeholders until merchant URLs are configured.
- Added editor controls for drawer-logo width, separate desktop/mobile sticky top offsets and corner radii, and the mobile nested-panel duration. The checked-in Shopify section-group values now match the floating demo card instead of retaining the older zero-inset state.
- Preserved the Shopify-synced `pebble-demo` navigation and merchant block data while removing the duplicated announcement/hero pair that had been added to the homepage template.
- Kept the top-of-page mega menu full viewport width, while constraining a sticky floating header's mega menu to the card's exact left and right edges. The panel now drops directly below the card and shares its rounded lower corners without changing the menu content layout.

### August 4, 2026 submenu choreography and localization revision

- Split desktop/tablet parent links into two merchant-controlled layouts: matching Women/Men blocks retain the full-width mega menu, while Pages and parent links without a matching block use the compact 338 px card.
- Sequenced transparent-header opening into one continuous vertical reveal: the white header surface completes first, then the submenu background continues downward from the header edge.
- Added a bottom-up content glide for full mega menus and a right-to-left content glide for compact Pages and country panels, including correct remaining-delay handling when the pointer switches menus mid-animation.
- Rebuilt the country selector as a 414 px searchable panel using Shopify's country flag images. The header shows the selected flag and currency; every result shows the real flag, country name, ISO currency, and symbol.
- Added editor controls for submenu surface timing, panel timing, content timing/delay, compact-menu width, country-panel width, and compact-panel radius.
- Mirrored Pages, searchable countries, flag imagery, and the synchronized motion in the standalone demo for direct local verification.

### August 5, 2026 seamless mega-menu handoff

- Re-timed the transparent white surface with a balanced easing curve and a configurable 55 ms panel overlap, removing the visible pause between the header and full mega-menu reveals.
- Forced an initial rendered panel state before the open class is applied so repeated hover openings consistently animate instead of occasionally jumping to the end state.
- Removed the mega menu's top border, vertical offset motion, opacity fade, and header bottom-border seam; the panel now overlaps the header by one pixel and reveals as one solid white sheet.
- Staged the desktop country panel after its closed state is rendered so its top-down animation is also repeatable.
- Added the `Panel handoff overlap` Shopify editor control and mirrored the corrected timing in the standalone demo.

### August 5, 2026 single-sheet mega-menu motion

- Rechecked the password-protected reference theme and matched its actual motion model: one shared white background grows from the header top to the combined header-and-mega-menu height.
- Removed the independent mega-menu background and reveal transition, so opening and closing can no longer expose two separately moving white surfaces or a seam between them.
- Matched the live sheet timing at 300 ms with `cubic-bezier(.6, .14, 0, 1)`, shortened the header color change to 150 ms, and reduced the content travel to 15 px over 200 ms.
- Made JavaScript measure the active Shopify menu's rendered height before the open state is painted. This keeps the shared surface exact for merchant-managed links, promotion cards, and product content at desktop and tablet widths.
- Reduced desktop hover-close intent to 70 ms and preserved compact Pages/country sequencing as a separate editor-controlled behavior.
- Mirrored the same shared-height surface, fast close, easing, and content glide in the standalone demo.

### August 5, 2026 sticky, repeated-motion, and mobile-drawer correction

- Kept the floating desktop/tablet header fixed above page content during continued downward scrolling. Auto-hide remains an editor option, but is disabled in the checked-in section group and new-section defaults.
- Restored tablet desktop navigation at 768 px and wider, with tighter gaps, smaller action targets, and a 90 px logo between 768 and 899 px. The hamburger layout now begins at 767 px.
- Changed compact Pages and country/currency contents from one moving block to individual top-down rows with 35 ms staggered delays.
- Kept localization panels mounted through their exit transition and reset every item before reopening, so hover, focus, click, and repeated currency openings replay the animation consistently.
- Added the missing animated underline to direct top-level links such as Find your shoes and restored text-only underline motion inside full and compact submenus.
- Matched the mobile captures with an inset, rounded, narrow left navigation rail and wider right search/cart panels. Second- and third-level navigation panels retain the same right-to-left stage transition.
- Updated search to use the reference pill input and Popular searches chips. Updated the empty cart to use the reference support line and three stacked collection pills without the decorative bag icon.

Run it from the repository root with:

```powershell
node demo/server.mjs
```

Then open <http://127.0.0.1:4173/>. Check the desktop/tablet mega-menu, repeated Pages/currency openings, the always-visible floating header, search/account/cart drawers, announcement controls, and the mobile menu at 767 px or below. The standalone preview includes a third navigation level: Menu → Women/Men → By activity/By feature. This preview is not a Shopify runtime; use Shopify CLI for real menu, market, predictive-search, customer, product, and cart data.

## Production Shopify conversion — August 4, 2026

The repository root is now a minimal valid Shopify theme and can be previewed or uploaded without copying files into another project. The conversion includes:

- `sections/header.liquid` — the merchant-configurable header section and comprehensive section/block schema.
- `sections/announcement-bar.liquid` — configurable announcements with deterministic bottom-to-top motion, synchronized fade, manual arrows, autoplay, pause controls, and reduced-motion handling.
- `sections/predictive-search.liquid` — Shopify predictive-search results for suggestions, products, and collections.
- `sections/header-group.json` — ready-to-render announcement and header group with Women and Men mega-menu blocks.
- `snippets/helix-desktop-nav.liquid` and `snippets/helix-mega-menu.liquid` — menu-driven desktop navigation where every parent item receives a full-viewport panel; matching editor blocks add optional promotional or collection content.
- `snippets/helix-mobile-menu.liquid` — a native modal drawer with generated root, second-level, and third-level panels. Every child menu that has grandchildren receives a right-to-left third-level panel and an animated back path.
- `snippets/helix-mega-feature.liquid` — two editor-managed promotion cards or live collection products with pricing, discounts, and optional quick add.
- `snippets/helix-localization.liquid` — native Shopify localization forms backed by the store’s configured countries, currencies, and languages.
- `snippets/helix-search-drawer.liquid` and `snippets/helix-cart-drawer.liquid` — real Shopify search and cart fallbacks, cart item state, quantity forms, checkout, and empty-cart links.
- `assets/helix-header.css` — responsive tokens, transparent/solid/sticky states, synchronized label/chevron motion, full-width desktop and tablet panels, under-header blur layering, inset phone drawers, and reduced-motion overrides.
- `assets/helix-header.js` — hover/focus mega menus, repeatable localization motion, native dialog lifecycle, focus return, scroll locking, sticky visibility, mobile panel stack, predictive search, quick add, and cart-count refresh.
- `layout/theme.liquid`, `templates/index.json`, `config/`, and `sections/main-helix-demo.liquid` — the minimal Shopify theme runtime and an editor-configurable hero for checking the transparent header.
- `locales/` — storefront and schema translations for every built-in header/announcement label.

### Transparent and solid color contract

At the top of the homepage, navigation text, chevrons, action icons, cart state, and the logo are white. If a separate transparent logo is not selected, the supplied image logo is converted to white while transparent. Opening a mega menu/localization panel or entering the sticky state changes the header to a white surface with dark content. The header and menu surface become full viewport width while a desktop menu is active, and blur is restricted to the page below the header.

### Shopify theme editor controls

The header editor exposes the following groups:

- Navigation: main menu, popular searches, and empty-cart links.
- Logo: standard image, optional white/transparent image, and separate desktop/mobile/drawer widths.
- Position and motion: transparent homepage mode, sticky behavior, optional scroll hide/reveal, desktop/mobile top and side insets, radius, z-index, and independent header/desktop-panel/mobile-panel durations.
- Sizing and typography: desktop/mobile heights, horizontal spacing, navigation gap, size, weight, line height, and letter spacing.
- Colors and overlay: solid surface/content, transparent content, border, overlay color/opacity, and backdrop blur.
- Controls and markets: search, account, cart, country/currency, language, and editable currency badge.
- Drawers and social links: search/cart drawer width plus Facebook/Instagram/YouTube/TikTok URLs; all four social icons stay visible as styled placeholders until URLs are configured, and mobile navigation uses the narrow inset rail shown in the approved captures.
- Mega-menu blocks: exact trigger label, quick-link heading, content mode, two complete promotion cards, or collection/product count/prices/discount/quick-add controls.

Shopify navigation supplies all menu headings and URLs. Create a three-level menu such as:

```text
Women
├─ Top picks
├─ Best sellers
├─ By activity
│  ├─ Hiking
│  ├─ Running
│  └─ Training
└─ By feature
   ├─ Cushioned
   └─ Waterproof
```

Direct second-level links appear as quick links. Second-level links with children become desktop columns and mobile disclosure rows. Their children become the mobile third-level panel, so no headings or destinations need to be duplicated in Liquid.

### Run as a Shopify theme

Authenticate Shopify CLI, then run from this repository root:

```powershell
shopify theme dev --store your-store.myshopify.com --path .
```

Alternatively, package or upload the repository as a theme, open Customize → Header group, select the main menu, and add one mega-menu block for each matching top-level label. Assign promo imagery or a collection in each block. Store market/language availability, customer URLs, products, money formatting, cart contents, and predictive results are read from Shopify at render time.

### Verification completed

- Shopify CLI `4.5.2` Theme Check: zero errors across the theme. The remaining warnings come only from the two standalone `examples/` fixtures, where `section` is intentionally undefined outside a real section runtime.
- JavaScript syntax checks pass for the production header and static demo.
- JSON parsing passes for locales, theme settings, section group, and index template.
- Source and syntax verification covers the 1440 × 900, 772 × 900, and 390 × 844 responsive states. The in-app browser could not reload the local preview during the August 5 correction because local navigation was blocked by the app URL policy, so visual re-checking remains a reviewer step. The implementation includes transparent white controls, non-persistent underlines, synchronized active underline/chevron, full-width mega menus, always-visible floating behavior, the 768/767 header switch, narrow mobile navigation, four social controls, and right-to-left third-level panels.

## Deliverables

| File | Purpose |
| --- | --- |
| `README.md` | This project record: scope, evidence, architecture, tokens, behavior, accessibility, and acceptance criteria. |
| `docs/helix-header-implementation-prompt.md` | Full implementation prompt with the complete observation log, measurements, CSS behavior, Liquid schema, interaction states, and verification plan. |
| `examples/header-schema-validation.liquid` | Minimal, Theme Check-validated header section/schema example used to prove the settings and block model. |
| `examples/announcement-bar-schema-validation.liquid` | Minimal, Theme Check-validated announcement-bar section/schema example. |
| `demo/` | Runnable static preview for visual and interaction review of the documented header states. |
| `sections/`, `snippets/`, `assets/` | Production Shopify header, announcement, search, cart, responsive navigation, styling, and behavior. |
| `layout/`, `templates/`, `config/`, `locales/` | Minimal Online Store 2.0 theme shell, theme settings, header group, homepage preview, and translations. |

The local working copy also contains the original design document at `outputs/helix-header-implementation-prompt.md`.

## What was inspected

The storefront was opened with the supplied password and inspected using controlled viewport sizes and live DOM/CSS inspection. The following states were covered:

- Desktop: 1440 × 900 and 1280 × 800.
- Desktop/tablet versus mobile layout switch: 768 px and 767 px.
- Tablet desktop-navigation layout: 820 × 900 and 772 × 900.
- Mobile: 390 × 844.
- Homepage at the top and after scrolling.
- A collection page at the top.
- Announcement carousel, closed header, always-visible floating desktop/tablet header, and optional merchant-controlled hide/reveal behavior.
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

### Observed reference breakpoints and dimensions

| Viewport | Layout | Header | Horizontal inset | Logo | Action target |
| --- | --- | ---: | ---: | ---: | ---: |
| ≥ 992 px | Desktop | 80.39 px | 50 px | 110 × 19 px | 44 × 44 px |
| 768–991 px | Compact desktop/tablet navigation | 68–80 px | 16–28 px | 90 × 15.5 px | 28–40 px visual target with accessible labels |
| ≤ 767 px | Mobile controls | 56 px | 16 px | 90 × 15.5 px | 40 × 40 px (use 44 px hit area where possible) |

The inspected reference used an exact `@media (min-width: 992px)` switch in its loaded stylesheet, while the review captures require the desktop-style tablet navigation around 772–820 px. The delivered production section therefore uses 768/767 as the approved implementation boundary: hover navigation starts at 768 px, and the mobile panel stack is active at 767 px and below.

## Implemented header architecture

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
- Keep the floating header visible during continued downward scrolling by default. Preserve the optional merchant-controlled auto-hide mode and respect `prefers-reduced-motion`.
- At 767 px and below, navigation uses a narrow inset left rail with rounded corners; search and cart use wider inset right panels. The nested menu stages inherit the navigation rail's exact geometry.
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

- [x] Desktop/tablet navigation renders at 768 px and above; the three-level mobile drawer renders at 767 px and below.
- [x] At 390 px the navigation drawer uses the approved narrow inset rail, root links retain their 20 px content inset, and all four social controls are present.
- [x] Announcement spacing, header/logo/action geometry, drawer sizing, colors, and typography match the approved demo tokens.
- [x] Homepage transparent state, white menu-active state, and always-visible floating sticky card are implemented in both production and demo sources; optional hide/reveal remains merchant-controlled.
- [x] Mega-menu groups, promotion cards, product feature cards, scrim, chevron, underline, and item entrance motion are present.
- [x] Search, account, cart, currency, mobile menu, second-/third-level menus, and empty cart states are connected to Shopify routes and data.

### Behavior and accessibility

- [ ] Every disclosure works with mouse, touch, keyboard, and screen reader semantics.
- [ ] Escape, outside click, route change, and close buttons consistently close panels and restore focus.
- [ ] Drawer focus is trapped and page scroll is locked while open.
- [ ] Icon controls have labels, active routes have `aria-current`, and the announcement carousel has a polite live region.
- [x] Reduced motion disables autoplay and reduces non-essential transitions.
- [ ] No layout shift or horizontal overflow occurs at 390, 767, 768, 772, 820, 992, 1280, and 1440 px widths.

### Quality gates

- [x] Theme Check passes with zero errors for all production Liquid/schema files.
- [ ] Keyboard-only and screen-reader smoke tests pass.
- [ ] Lighthouse/axe checks show no new header landmark, name, contrast, or focus violations.
- [ ] Re-run browser snapshots at desktop, 772 px tablet, and 390 × 844 mobile after the latest responsive correction; the original inspection log and supplied captures cover the target states.
- [x] No storefront password, personal token, customer data, or browser session data is committed.

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
