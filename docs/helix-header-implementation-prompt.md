# Helix Header — Shopify Theme Implementation Prompt

## Objective

Build a production-ready Shopify header that closely matches the header at `https://helix-shoes-theme.myshopify.com/`, including its announcement carousel, transparent homepage treatment, solid inner-page treatment, desktop mega menus, tablet/mobile drawer navigation, sticky behavior, search/cart drawers, responsive transitions, typography, colors, motion, layering, and accessible interaction states.

Use this document as the implementation brief for a coding agent or theme developer. Treat values marked **Observed** as the replication baseline. Treat values marked **Inferred** as conclusions derived from the loaded DOM and CSS where the visual state could not be opened reliably. Treat values marked **Recommended** as intentional accessibility or maintainability improvements over the reference.

## Inspection scope and evidence

The password-protected storefront was opened with the supplied password. The header was inspected at controlled viewport widths and in multiple states:

- Desktop: 1440 × 900 and 1280 × 800.
- Desktop/tablet versus mobile switch boundary: 768 px and 767 px.
- Tablet desktop-navigation views: 820 × 900 and 772 × 900.
- Mobile: 390 × 844.
- Homepage at the top, homepage after scrolling, and a collection page at the top.
- Closed header, mobile navigation drawer, nested mobile mega-menu panel, search drawer, cart drawer, keyboard focus, and scroll-down/scroll-up sticky behavior.
- Live DOM, computed styles, CSS custom properties, loaded stylesheet rules, animation keyframes, and accessible attributes.

## Confidence and limitations

### Directly observed

- Exact breakpoint behavior, header and announcement dimensions, padding, logo sizes, icon sizes, font metrics, colors, sticky states, drawer geometry, search/cart layouts, z-indexes, focus outline, responsive menu content, and loaded transition/keyframe definitions.
- The homepage transparent header, inner-page solid header, desktop floating sticky card, mobile hide/reveal sticky header, mobile navigation drawer, nested Women menu panel, search drawer, and empty cart drawer.
- The full desktop menu data model in the DOM: Women, Men, Pages, all child links, two Women promotion cards, and the Men product feature area.

### Inferred from DOM/CSS, not visually confirmed in the final open state

- Desktop mega-menu open-panel dimensions and the exact pointer event that opens it. The DOM uses `details/summary`, and the CSS defines open-state height, opacity, item reveal, overlay, and chevron behavior. Clicking the top-level Women disclosure through automation followed its collection link instead of holding the mega menu open.
- The final desktop Pages dropdown width and exact open placement. Its content and animation rules were directly inspected.
- The currency selector's open popover. Only the closed control was measured.

### Not observed

- A non-empty cart badge and non-empty cart drawer.
- A signed-in customer account state.
- Hover pixels for every icon button, because several icon controls retain the same computed foreground color and rely on generic button rules.
- A visual current-page state. On `/collections/all-womens`, the reference emitted no `aria-current`, no active class, and no underline for Women.

## Required architecture

Implement the header as a Shopify header section group:

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

Keep both desktop and mobile header markup in `header.liquid`, but expose only one version at a time with CSS. Render both logo variants when necessary, but only one image may contribute to the accessibility tree. Keep all user-facing strings in locale files. Use Shopify routes (`routes.root_url`, `routes.search_url`, `routes.cart_url`, `routes.account_url`) rather than hard-coded store URLs.

Use semantic HTML: a native `<header>` landmark, a native `<nav aria-label="Primary">`, `<ul>` lists, separate anchor and disclosure-button targets for top-level items with children, native `<dialog>` for navigation/search/cart drawers, and `<details>/<summary>` only where their native behavior is not compromised by an embedded link.

## Observable visual specification

### 1. Announcement bar

**Observed**

- Height: 38.39 px; implement as 38 px with an allowed rendered tolerance of ±1 px.
- Full viewport width.
- Internal vertical padding: 8 px; content line height: 22.4 px.
- Background: `#D3F285`.
- Foreground: `#1A1312`.
- Font: Figtree, 14 px, weight 400, normal letter spacing, line-height 1.6.
- Desktop content stage: approximately 700 px wide and centered.
- Previous and next buttons: 32 px wide and the full 38 px bar height; icons are 24 px line chevrons.
- Two messages are present:
  1. “Free shipping for all orders over 5.000.000₫”.
  2. “Receive 20% off your first order. Shop now”, with an underlined collection link.
- Carousel autoplay is configured as `data-autoplay="5"`, meaning five seconds per message.
- Previous and next controls have accessible names.
- The inactive carousel item uses `opacity: 0` and `visibility: hidden`. No non-zero fade duration was found for the item itself, so the reference appears to switch messages discretely.
- The announcement scrolls away naturally; it is not part of the fixed mobile or floating desktop sticky card.

**Recommended**

- Pause autoplay on hover and whenever keyboard focus is within the bar.
- Pause when the document is hidden.
- Honor `prefers-reduced-motion: reduce` by disabling autoplay or requiring manual navigation.
- Do not automatically announce every timed slide to screen readers. Use `aria-live="polite"` only for user-initiated changes.

### 2. Desktop and tablet header: 768 px and wider

**Observed**

- Desktop markup becomes visible at 768 px. It is hidden at 767 px.
- Header height: 80.39 px; implement as 80 px.
- Horizontal section padding: 50 px.
- Header row vertical padding: 24 px.
- Grid: `1fr auto 1fr`, keeping the logo geometrically centered regardless of left/right content width.
- Grid gap: 10 px.
- Left and right columns use flex alignment with 20 px item gap.
- Logo: centered image, 110 × 19 px, linked to `/`.
- Top-level navigation: Figtree, 14 px, weight 500, line-height 22.4 px, letter spacing `0.02em` (0.28 px), no text transform.
- Each top-level title has 5 px vertical and 12 px horizontal padding; rendered height is 32.4 px.
- Visible order on the left: Women, Men, Pages, Find your shoes.
- Women, Men, and Pages include 16 px chevrons. `Find your shoes` is a direct link without a chevron.
- Right-side order: country/currency, separator, search, account, cart.
- Country/currency closed control: Vietnam flag, `VND ₫`, 16 px chevron; measured width approximately 88.8 px and height 16 px.
- Search, account, and cart hit areas: 44 × 44 px, built from a 24 px icon plus 10 px padding.
- Icon stroke token: 1.4; use `currentColor`, rounded joins and caps.
- Default solid header background: `#FFFFFF`.
- Solid foreground/body: `#323232`; heading/icon foreground: `#131313`.
- No visible bottom border at the top of the homepage. The inner page uses the same white header with dark controls.

### 3. Transparent homepage state

**Observed**

- On the homepage, when the first content section supports a transparent header, the header overlays the hero.
- The section uses a negative bottom margin equal to the header height, allowing hero media to extend behind it.
- Background is transparent.
- Navigation, logo, currency, and action icons are white: `#FFFFFF`.
- Transparent border token: `rgba(255,255,255,0.20)`.
- Transparent shadow token: `rgba(255,255,255,0.10)`.
- The homepage uses a white logo image; the solid/scrolled state uses the dark logo image.
- Header and announcement group z-index: 20.

Only enable transparent mode when all of the following are true:

- Page type is the homepage.
- The first section explicitly opts in, for example with a `data-allow-transparent-header` attribute.
- The header is at the top and no menu/search/cart overlay is open.

Opening any header surface must immediately switch the header to a solid white/dark-foreground state so menu content remains legible.

### 4. Desktop sticky state

**Observed**

- Desktop sticky behavior is `always`.
- The section itself is `position: sticky; top: 0; z-index: 20`.
- Once the page is scrolled, the header becomes a floating white card:
  - 50 px viewport inset on the left and right.
  - 16 px top offset.
  - 16 px corner radius.
  - 30 px additional internal horizontal padding.
  - White background and dark foreground.
  - Subtle shadow generated by a pseudo-element: 0 1 px 5 px 0 `rgba(0,0,0,0.10)`.
- Header transform/box transition: 0.5 s `cubic-bezier(0.625, 0.05, 0, 1)`.
- Internal horizontal-padding transition: 0.35 s ease-in-out.
- Background opacity transition: 0.2 s `cubic-bezier(0.6, 0, 0.4, 1)`.
- The floating card remains visible during continued downward scrolling.

### 5. Mobile header: 767 px and narrower

**Observed**

- Mobile markup is visible at 767 px and below.
- Height: 56 px.
- Three visual zones:
  - Left: hamburger/menu toggle.
  - Center: logo.
  - Right: search and cart.
- Account and country/currency are removed from the header row and moved into the navigation drawer.
- Tablet desktop-navigation padding from 768–899 px is tightened to 16 px; from 900–1199 px it is capped at 28 px.
- Mobile horizontal padding at 767 px and below: 16 px.
- Menu/search/cart targets in the reference are 40 × 40 px, with a 24 px icon and 8 px padding.
- Logo: 90 × 15.5 px.
- Homepage top state is transparent with white controls and logo.
- Scrolled state is full-width, flat white, dark foreground, no floating side inset, and no rounded card.

**Recommended accessibility adjustment**

Preserve the 24 px visible icons and 56 px header height, but enlarge the actual interactive target to at least 44 × 44 px with transparent padding or pseudo-element hit areas.

### 6. Mobile sticky behavior

**Observed**

- Mobile/tablet sticky mode is `scroll_up`.
- Scrolling down adds a scrolling state and translates the 56 px header upward by approximately 110% (`-59.7` to `-61.6` px), fully hiding it.
- Scrolling up adds a pinning state and returns the transform to `none` at `top: 0`.
- Transform transition: 0.5 s `cubic-bezier(0.6, 0, 0.4, 1)` with a 0.2 s delay.
- The solid background fades with the same timing.
- The announcement bar does not return with the sticky header.

Use a small directional threshold, approximately 8–12 px, to prevent jitter. Do not hide the header while a drawer or disclosure is open, while a header input has focus, or within the first header-height of the page.

**Approved implementation update — August 5, 2026**

The checked-in section keeps the floating header visible on desktop, tablet, and mobile. `hide_on_scroll` remains available for merchants that prefer the observed directional behavior, but its schema default and the supplied header-group value are `false`.

## Navigation and mega menus

### Desktop menu data

**Observed: Women mega menu**

- Three navigation columns.
- Quick links: Top picks, Best sellers, Trending, New arrivals, On sale.
- “By activity”: Hiking, Running, Training, Tennis, Lifestyle, Shop all.
- “By feature”: Cushioned, Waterproof, Water-resistant, Breathable, Windproof.
- Two promotional cards:
  - Women’s sale.
  - Women’s favorites.

**Observed: Men mega menu**

- Three navigation columns with the same quick-link pattern.
- “By activity”: Hiking, Running, Training, Tennis, Lifestyle, Shop all.
- “By feature”: Cushioned, Waterproof, Water-resistant, Breathable, Windproof.
- Featured product area with five products in the loaded DOM: Prime form, Base line, Form core, Frame one, Drift prime.

**Observed: Pages dropdown**

- About us, Contact, Faqs, Store locations, Recently viewed, Our journal.

### Desktop mega-menu appearance and motion

**Observed from CSS/DOM; open visual dimensions inferred**

- The panel is absolutely positioned directly below the header and spans the header width plus its horizontal padding.
- Solid white background with dark text. The visible white area must be one shared surface behind both the header and mega menu, not two adjacent backgrounds.
- Inner vertical padding: 40 px.
- Container horizontal padding follows the 50 px page/header inset.
- Main content uses flex with 40 px gap.
- Navigation list uses a three-column grid.
- Individual columns use 15 px padding and 16 px vertical content gaps.
- Measure the active menu before opening and transition one shared surface from its closed header height to the combined header-plus-menu height. In transparent mode, that same surface grows from 0 to the complete combined height.
- Maximum open height: `85svh - mega-menu top`; overflow becomes vertically scrollable when required.
- Shared surface: height 0.3 s `cubic-bezier(0.6, 0.14, 0, 1)` on both open and close. Do not delay a second panel animation or paint an independent panel background.
- Individual menu columns/product cards: start at opacity 0 and `translate3d(0, 15px, 0)`, then animate to opacity 1 and zero translation over 0.2 s, beginning after a 0.07 s delay. Remove that delay on close so content clears before the shared sheet retracts.
- The chevron flips vertically with `scaleY(-1)`.
- Link underline: 1 px current-color pseudo-element; width animates from 0 to 100% over 0.2 s ease-in-out.
- Page overlay: `rgba(50,50,50,0.50)`, 20 px backdrop blur, 0.3 s fade in/out.
- Header z-index increases to 21 while a dropdown is open; the internal menu panel uses z-index 2.

**Recommended interaction contract**

- Use a separate parent anchor and disclosure button. Do not make the entire disclosure target also navigate.
- On fine pointers, open after a 100–150 ms hover-intent delay and keep the panel open while the pointer is over either the trigger or panel.
- On touch and click, toggle explicitly.
- On keyboard, Enter/Space toggles the button; Escape closes; arrow keys may optionally move among top-level items.
- Set `aria-expanded` and `aria-controls` on the disclosure button.
- Close sibling menus when another opens.
- Restore focus to the trigger when Escape closes the panel.

## Mobile navigation drawer

**Observed at 820 px**

- Left drawer, 400 px wide, 16 px inset from viewport edges, viewport height minus 32 px, 16 px radius.
- White background over a full-screen blurred/dimmed overlay.
- Header contains a 90 px dark logo and a 40 px close target.
- Top-level rows use Figtree 16 px, weight 500, line-height 25.6 px, letter spacing 0.32 px.
- Row height: approximately 57.6 px, based on 16 px vertical padding.
- Dividers: 1 px `#E5E5E5`.
- Footer stays at the bottom with a dark pill Login button, country/currency, language selector, and Facebook/Instagram/YouTube/TikTok icon buttons.

**Observed at 390 px**

- Drawer inset: 8 px on every edge.
- Drawer size: 374 × 828 px in a 390 × 844 viewport.
- Radius remains 16 px.
- Entry animation: from `translateX(-100%)` to 0 over 0.5 s `cubic-bezier(0.7, 0, 0.2, 1)`.
- Document scrolling is locked while open.

**User-confirmed implementation override**

- Treat the reference observation above as historical evidence, not the final target below 500 px.
- At 499 px and narrower, every drawer surface must occupy the full viewport width and height: `width: 100vw`, `top: 0`, `bottom: 0`, no viewport inset, and no corner radius. This applies consistently to the main menu, second- and third-level navigation stages, search, account, and cart.
- From 500 through 767 px, keep the partial layout: the narrower left navigation rail and the wider inset right-side utility drawers with rounded corners.
- Do not change the desktop/tablet navigation switch: desktop navigation begins at 768 px; mobile controls end at 767 px.
- Drawer entry and exit use the same 520 ms `cubic-bezier(0.7, 0, 0.2, 1)` transform. Render the closed off-canvas state for at least one completed paint before adding the visible state so native dialogs never pop directly into place.
- Expose the drawer transition duration in the Shopify section editor, independently from the faster desktop mega-menu transition.

**Observed nested Women panel**

- Replaces the first panel inside the same drawer.
- Header: back arrow, bold Women title, close button.
- First links use bold Archivo 16 px, line-height 25.6 px: Top picks, Best sellers, Trending, New arrivals, On sale.
- Nested disclosure rows: By activity and By feature.
- Promotional content follows in a vertically scrollable area, including large rounded image cards and Shop now links.
- Nested panel animation: 0.3 s ease-in-out, translated horizontally by 100% to 0; reverse on back.

## Header actions and drawers

### Search

**Observed desktop**

- Opens a right drawer, not a search page navigation.
- In a 1280 × 720 viewport: drawer container is 550 px wide, inset 16 px from top/right/bottom, 16 px radius.
- Overlay covers the viewport at z-index 30 with `rgba(50,50,50,0.50)` and 20 px blur.
- Drawer container is z-index 31.
- Header is 73 px high with 16 px vertical and 30 px horizontal padding.
- Title: Archivo 18 px, weight 700, 25.2 px line-height, 0.36 px letter spacing.
- Close target: 40 × 40 px.
- Inner padding: 30 px.
- Search input: 484 × 48 px, fully pill-shaped, 1 px `#131313` border, `rgba(50,50,50,0.06)` fill, 16 px left padding, 60 px right reserve.
- Popular searches: Running shoes, Trail running shoes, Hiking shoes.
- The search input is automatically focused.

**Observed mobile**

- Right drawer, 8 px viewport inset, 374 × 828 px at 390 × 844, radius 16 px.
- Entry animation: `translateX(100%)` to 0 over 0.5 s `cubic-bezier(0.7, 0, 0.2, 1)`.
- Drawer header: 69 px, 16 px padding.
- Title: Archivo 17 px, 700, line-height 23.8 px, letter spacing 0.34 px.
- Close target: 36 × 36 px in the reference; implement a 44 px accessible hit area.
- Inner padding: 30 px vertically and 16 px horizontally.

For the final implementation, the user-confirmed under-500 override applies to this search surface: at 499 px and narrower it is edge-to-edge and square-cornered; from 500 through 767 px it keeps the partial inset treatment. Cart and account follow the same sizing and motion rules.
- Search input: 342 × 44 px, pill radius, transparent border, 6% dark neutral fill.
- Popular-search chips wrap onto multiple lines.

### Cart

**Observed**

- Uses the same desktop right-drawer geometry, overlay, radius, and z-index as search.
- Empty state: Cart heading, “Your cart is empty”, support text, then three full-width neutral pill links: Trending, Best sellers, On sale.
- Cart link is an icon-only control with accessible name Cart.

**Recommended for non-empty state**

- Add a compact count bubble that is visually hidden when zero.
- Give the count an accessible text equivalent such as “Cart, 2 items”.
- Update count with a polite live region after add-to-cart actions.

### Account and localization

**Observed**

- Desktop account is a 24 px outline-person icon inside a 44 px target and links to Shopify customer authentication.
- Mobile removes the icon from the header and provides a full-width Login pill in the navigation drawer.
- Desktop localization shows Vietnam flag + `VND ₫` + chevron before a subtle vertical separator.
- Mobile drawer footer exposes both country/currency and language selectors.

## Typography, colors, and tokens

Use these CSS variables as the baseline:

```css
:root {
  --font-body: "Figtree", sans-serif;
  --font-heading: "Archivo", sans-serif;
  --color-page-bg: #ffffff;
  --color-body: #323232;
  --color-heading: #131313;
  --color-border: #e5e5e5;
  --color-announcement-bg: #d3f285;
  --color-announcement-fg: #1a1312;
  --color-transparent-fg: #ffffff;
  --color-transparent-border: rgb(255 255 255 / 20%);
  --color-overlay: rgb(50 50 50 / 50%);
  --color-soft-hover: rgb(50 50 50 / 6%);
  --color-focus: #0b61cd;
  --shadow-sticky: 0 1px 5px rgb(0 0 0 / 10%);
  --radius-container: 16px;
  --header-height-desktop: 80px;
  --header-height-mobile: 56px;
  --announcement-height: 38px;
  --logo-width-desktop: 110px;
  --logo-width-mobile: 90px;
  --icon-size: 24px;
  --icon-stroke-width: 1.4;
  --header-padding-desktop: 50px;
  --header-padding-tablet: 30px;
  --header-padding-mobile: 16px;
  --drawer-inset-desktop: 16px;
  --drawer-inset-mobile: 8px;
  --drawer-width-menu: 400px;
  --drawer-width-search-cart: 550px;
  --overlay-blur: 20px;
}
```

Do not expose the responsive breakpoint as a merchant setting unless the generated CSS is guaranteed to update consistently. Use fixed implementation constants:

```css
@media (min-width: 768px) { /* desktop and tablet navigation */ }
@media (min-width: 768px) and (max-width: 899px) { /* compact tablet spacing */ }
@media (max-width: 767px) { /* mobile header and inset drawers */ }
```

## States and interaction details

### Hover

- Top-level and submenu links draw a 1 px underline from width 0 to 100% over 0.2 s ease-in-out.
- Submenu rows may use `rgba(50,50,50,0.06)` as a subtle hover background.
- Icon buttons may use the same 6% neutral fill in a circular hit area without moving the icon.
- Do not apply hover-only behavior on coarse pointers.

### Focus

**Observed global focus treatment:** 2 px solid `#0B61CD`, 1 px outline offset.

Apply this consistently to links, disclosure buttons, arrow controls, drawer close buttons, search input, localization selectors, and footer social buttons. Never remove the outline without an equally visible replacement.

### Open/active

- Flip disclosure chevrons vertically.
- Keep top-level underline at 100% while its menu is open.
- Switch a transparent header to solid while any overlay is open.
- Lock document scroll for navigation/search/cart drawers.
- Add `aria-current="page"` and a visible current-page underline in the new implementation. This is a recommended correction because the reference had no current-page signal on the Women collection.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Remove drawer slide motion and mega-menu item translation.
- Reduce fades to near-instant state changes.
- Disable announcement autoplay.
- Preserve all state changes and focus management.

## Accessibility requirements

The new implementation must improve several issues observed in the reference:

- Use native `<header>` and `<nav>` landmarks. The reference used custom `header-component` and `header-navigation` elements and exposed no native banner/navigation landmark inside the header.
- Ensure exactly one logo image supplies the accessible name. The reference rendered two logo images, both with alt “Helix Theme”, producing the accessible name “Helix Theme Helix Theme”. Mark the inactive visual variant `aria-hidden="true"` with empty alt, or render only one at a time.
- Preserve a single visually hidden H1 only when appropriate for page structure. The reference had a 1 × 1 px clipped H1 containing the shop name.
- Menu toggle must have `aria-expanded` and `aria-controls`. The reference button only had `aria-label="Menu toggle"`.
- Use native `<dialog>` or `role="dialog" aria-modal="true"`. The reference drawer was a `div` with an `open` attribute and no dialog role.
- Move focus into the drawer immediately on open, preferably to the close button or first meaningful link. The reference initially left focus on the behind-the-overlay toggle; focus entered the drawer only after Tab.
- Trap focus within an open modal drawer, then restore it to the trigger on close.
- Escape closes the topmost surface. Clicking the overlay closes it. Back in a nested mobile panel returns to the parent menu without closing the drawer.
- Search should retain its observed autofocus behavior.
- Minimum target size: 44 × 44 px.
- Announcement arrows require accessible names and disabled state when navigation is not possible.
- All icons are decorative within named controls and must be `aria-hidden="true"`.
- All image promotion cards need meaningful alt text or empty alt when adjacent text already names the link.
- Preserve logical DOM order: menu, logo, actions may be visually rearranged by grid, but keyboard order must remain understandable.
- Test at 200% zoom and 320 CSS px without horizontal scrolling.

## Shopify section schema

The following schema model was validated with Shopify's theme validator. It is a scaffold for the actual implementation; extend the markup and locale keys, but preserve the setting IDs unless migration is planned.

### `sections/header.liquid`

```liquid
<header
  class="helix-header{% if section.settings.transparent_on_home and request.page_type == 'index' %} helix-header--transparent{% endif %}"
  style="--header-height-desktop: {{ section.settings.desktop_header_height }}px; --header-height-mobile: {{ section.settings.mobile_header_height }}px; --header-padding-desktop: {{ section.settings.desktop_horizontal_padding }}px; --header-padding-tablet: {{ section.settings.tablet_horizontal_padding }}px; --header-padding-mobile: {{ section.settings.mobile_horizontal_padding }}px; --logo-width-desktop: {{ section.settings.logo_width_desktop }}px; --logo-width-mobile: {{ section.settings.logo_width_mobile }}px; --drawer-width: {{ section.settings.drawer_width }}px; --drawer-radius: {{ section.settings.drawer_radius }}px;"
  data-sticky-desktop="{{ section.settings.sticky_desktop }}"
  data-sticky-mobile="{{ section.settings.sticky_mobile }}"
>
  <a href="{{ routes.root_url }}">
    {% if section.settings.logo != blank %}
      {{ section.settings.logo | image_url: width: 440 | image_tag: widths: '180, 220, 330, 440', alt: shop.name }}
    {% else %}
      {{ shop.name | escape }}
    {% endif %}
  </a>
  <nav aria-label="{{ 'sections.header.primary_navigation' | t }}">
    <ul role="list">
      {% for link in section.settings.menu.links %}
        <li><a href="{{ link.url }}"{% if link.current %} aria-current="page"{% endif %}>{{ link.title | escape }}</a></li>
      {% endfor %}
    </ul>
  </nav>
  {% for block in section.blocks %}
    <div data-menu-trigger="{{ block.settings.trigger_label | escape }}" {{ block.shopify_attributes }}></div>
  {% endfor %}
</header>

{% schema %}
{
  "name": "Header",
  "tag": "section",
  "class": "section-header",
  "limit": 1,
  "settings": [
    { "type": "link_list", "id": "menu", "label": "Primary menu", "default": "main-menu" },
    { "type": "image_picker", "id": "logo", "label": "Logo" },
    { "type": "image_picker", "id": "transparent_logo", "label": "Transparent header logo" },
    { "type": "range", "id": "logo_width_desktop", "label": "Desktop logo width", "min": 80, "max": 180, "step": 2, "unit": "px", "default": 110 },
    { "type": "range", "id": "logo_width_mobile", "label": "Mobile logo width", "min": 70, "max": 140, "step": 2, "unit": "px", "default": 90 },
    { "type": "checkbox", "id": "transparent_on_home", "label": "Transparent on homepage hero", "default": true },
    { "type": "color_scheme", "id": "color_scheme", "label": "Solid header color scheme", "default": "scheme-1" },
    { "type": "color", "id": "transparent_foreground", "label": "Transparent header foreground", "default": "#FFFFFF" },
    { "type": "select", "id": "sticky_desktop", "label": "Desktop sticky behavior", "options": [
      { "value": "always", "label": "Always visible" },
      { "value": "scroll_up", "label": "Reveal on scroll up" },
      { "value": "none", "label": "Not sticky" }
    ], "default": "always" },
    { "type": "select", "id": "sticky_mobile", "label": "Mobile sticky behavior", "options": [
      { "value": "scroll_up", "label": "Reveal on scroll up" },
      { "value": "always", "label": "Always visible" },
      { "value": "none", "label": "Not sticky" }
    ], "default": "scroll_up" },
    { "type": "range", "id": "desktop_header_height", "label": "Desktop header height", "min": 64, "max": 104, "step": 2, "unit": "px", "default": 80 },
    { "type": "range", "id": "mobile_header_height", "label": "Mobile header height", "min": 48, "max": 72, "step": 2, "unit": "px", "default": 56 },
    { "type": "range", "id": "desktop_horizontal_padding", "label": "Desktop horizontal padding", "min": 20, "max": 80, "step": 2, "unit": "px", "default": 50 },
    { "type": "range", "id": "tablet_horizontal_padding", "label": "Tablet horizontal padding", "min": 16, "max": 48, "step": 2, "unit": "px", "default": 30 },
    { "type": "range", "id": "mobile_horizontal_padding", "label": "Mobile horizontal padding", "min": 12, "max": 32, "step": 2, "unit": "px", "default": 16 },
    { "type": "range", "id": "drawer_width", "label": "Drawer width", "min": 320, "max": 600, "step": 10, "unit": "px", "default": 400 },
    { "type": "range", "id": "drawer_radius", "label": "Drawer corner radius", "min": 0, "max": 32, "step": 2, "unit": "px", "default": 16 },
    { "type": "checkbox", "id": "show_country_selector", "label": "Show country and currency selector", "default": true },
    { "type": "checkbox", "id": "show_search", "label": "Show search", "default": true },
    { "type": "checkbox", "id": "show_account", "label": "Show account", "default": true },
    { "type": "checkbox", "id": "show_cart", "label": "Show cart", "default": true }
  ],
  "blocks": [
    {
      "type": "mega_menu",
      "name": "Mega menu",
      "settings": [
        { "type": "text", "id": "trigger_label", "label": "Top-level menu label" },
        { "type": "link_list", "id": "quick_links", "label": "Quick links" },
        { "type": "select", "id": "content_mode", "label": "Feature area", "options": [
          { "value": "promos", "label": "Two promotion cards" },
          { "value": "collection", "label": "Featured collection products" },
          { "value": "none", "label": "None" }
        ], "default": "promos" },
        { "type": "collection", "id": "featured_collection", "label": "Featured collection" },
        { "type": "image_picker", "id": "promo_image_1", "label": "First promotion image" },
        { "type": "text", "id": "promo_heading_1", "label": "First promotion heading" },
        { "type": "url", "id": "promo_link_1", "label": "First promotion link" },
        { "type": "image_picker", "id": "promo_image_2", "label": "Second promotion image" },
        { "type": "text", "id": "promo_heading_2", "label": "Second promotion heading" },
        { "type": "url", "id": "promo_link_2", "label": "Second promotion link" }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [{ "name": "Header" }]
}
{% endschema %}
```

### `sections/announcement-bar.liquid`

```liquid
<aside
  class="helix-announcement"
  aria-label="{{ 'sections.announcement.label' | t }}"
  style="--announcement-height: {{ section.settings.height }}px;"
  data-autoplay-seconds="{{ section.settings.autoplay_seconds }}"
>
  {% for block in section.blocks %}
    <div {{ block.shopify_attributes }}>
      {% case block.type %}
        {% when 'message' %}
          {{ block.settings.text }}
        {% when 'free_shipping' %}
          {{ 'sections.announcement.free_shipping' | t: threshold: block.settings.threshold }}
      {% endcase %}
    </div>
  {% endfor %}
</aside>

{% schema %}
{
  "name": "Announcement bar",
  "tag": "section",
  "class": "section-announcement-bar",
  "limit": 1,
  "settings": [
    { "type": "color_scheme", "id": "color_scheme", "label": "Color scheme", "default": "scheme-4" },
    { "type": "range", "id": "height", "label": "Height", "min": 32, "max": 56, "step": 1, "unit": "px", "default": 38 },
    { "type": "checkbox", "id": "autoplay", "label": "Auto-rotate messages", "default": true },
    { "type": "range", "id": "autoplay_seconds", "label": "Seconds per message", "min": 3, "max": 10, "step": 1, "unit": "s", "default": 5 },
    { "type": "checkbox", "id": "show_arrows", "label": "Show previous and next buttons", "default": true }
  ],
  "blocks": [
    {
      "type": "message",
      "name": "Message",
      "settings": [
        { "type": "inline_richtext", "id": "text", "label": "Text", "default": "Receive 20% off your first order. <a href=\"/collections/all\">Shop now</a>" }
      ]
    },
    {
      "type": "free_shipping",
      "name": "Free shipping threshold",
      "settings": [
        { "type": "text", "id": "threshold", "label": "Formatted threshold", "default": "$200" }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [{ "name": "Announcement bar" }]
}
{% endschema %}
```

## JavaScript behavior contract

Implement a small custom element or controller for each concern rather than one large global script:

- `HeaderStickyController`: reads scroll direction with `requestAnimationFrame`, applies `is-scrolling` and `is-pinning`, and never runs layout-heavy work on every raw scroll event.
- `HeaderMenuController`: owns desktop disclosures, hover intent, Escape handling, sibling closure, overlay, and transparent-to-solid switching.
- `DrawerController`: wraps native dialog open/close, focus management, scroll lock, overlay click, nested-panel history, and focus restoration.
- `AnnouncementCarousel`: timed rotation, manual arrows, pause rules, document visibility, reduced motion, and editor block selection.
- `PredictiveSearchController`: debounced request, loading/busy state, aborting stale requests, result announcement, keyboard navigation, clear action, and submit fallback.

Avoid measuring `height: auto` every animation frame. Measure the panel once at open, set a CSS variable for the target height, animate, then clear the inline height after completion. In the Shopify editor, respond to section and block select/deselect events without autoplay fighting the editor.

## Approved implementation overrides — August 4, 2026

These decisions were made during visual review of the converted Shopify section and supersede conflicting geometry or behavior from earlier observations:

- Desktop/tablet navigation is active at 768 px and wider. Between 768 and 899 px, reduce navigation gaps, action sizes, and logo width so the centered layout remains collision-free. Use the centered-logo hamburger header at 767 px and below.
- Every top-level Shopify menu item with children opens the same full-width desktop mega-menu surface, even when no matching editor block exists. A matching block only adds optional promotion or collection content.
- Do not show a permanent underline for `link.current` or `link.child_active`. Keep `aria-current` for assistive technology; animate the text-only underline during hover, focus-within, and open states. Rotate the neighboring chevron over the identical duration/easing without including it in the underline.
- At 767 px and below, the navigation drawer is a narrow left rail with a 6 px viewport inset and 9 px corners. Search/cart drawers are wider right rails with the same inset and corners. Root link content uses 20 px inline padding.
- A parent row is one full-width disclosure button. Its destination link moves to the heading of the resulting nested panel. Level-two and level-three panels enter from the right while the previous panel exits left over 520 ms `cubic-bezier(.7,0,.2,1)`.
- The root drawer footer always displays four styled social circles. When a merchant URL is blank, render a non-interactive, `aria-hidden` icon placeholder rather than removing the circle.
- Use a 64 px drawer heading, 59 px drawer logo, 42 px login pill, 47 px localization row, and 53 px social row.
- Make the floating header sticky after 28 px and keep it visible during continued downward scrolling by default. Retain the editor's optional accumulated-intent auto-hide mode for merchants that explicitly enable it.
- Insert a `.25em` inline gap before the free-shipping `<strong>` and message `<a>` elements. This recreates an ordinary typed space despite those nodes being separate flex items.

## Latest responsive and interaction correction — August 5, 2026

- Use desktop/tablet navigation from 768 px upward and the hamburger header at 767 px and below. Between 768 and 899 px, use 16 px header padding, 12 px navigation gaps, 12 px navigation text, a 90 px logo, and smaller visual action boxes so the three-column grid remains centered without overlap.
- Keep the sticky positioner `fixed` above page content once the page passes 28 px. The supplied configuration does not add the hidden state while scrolling down.
- For compact Pages and currency panels, reveal the panel surface top-down, then reveal each search/row item from `translateY(-12px)` and `opacity: 0` with a 35 ms stagger. Do not move all contents as one horizontal block.
- Reset item opacity/transform and force a closed-state layout before applying the open class. Keep localization `<details>` mounted until its exit transition completes, cancel its close timer when reopened, and clear sequence classes after every close. This makes repeated hover/focus/click openings animate reliably.
- Direct links such as Find your shoes use the same text-only underline pseudo-element as parent labels. Full mega-menu links and compact submenu label spans also animate the underline from right-origin closed to left-origin open; never underline the chevron.
- At mobile widths, use a 6 px viewport inset and 9 px radius. Navigation uses `min(clamp(200px, 64vw, 400px), 100vw - 12px)` on the left. Search/cart use `min(clamp(275px, 86vw, drawer-width), 100vw - 12px)` on the right.
- Keep the root, second-level, and third-level navigation inside one clipped stage. Forward navigation moves the source to the left and the target from the right; Back reverses the direction. The root footer retains Login, localization, and four social circles.
- Search uses a bordered pill field followed by Popular searches chips. The empty cart omits the decorative cart icon and exposes three stacked gray collection pills beneath its support text.

## Acceptance criteria

### Visual and responsive

- At 1440 px, header is 80 ±1 px high with 50 px side insets, a 110 px centered logo, left navigation, currency, and three 44 px action targets.
- At 768 px, the compact desktop/tablet header remains active. At 767 px, it switches to the mobile header.
- At 820 px, 772 px, and 768 px, desktop/tablet hover navigation remains active without overlapping the centered logo or actions.
- At 390 px, the header is 56 px high, the header logo is 90 px wide, the drawer logo is 59 px wide, and navigation uses the inset narrow left rail.
- Homepage at top is transparent over the hero; collection/product/content pages are solid white.
- Desktop after scroll becomes a rounded floating card with a 12 px default top offset, 50 px default side inset, and subtle shadow; all three values remain editor-adjustable.
- The checked-in header remains visible while scrolling on desktop, tablet, and mobile. If the merchant explicitly enables auto-hide, deliberate upward intent restores it as a white floating header.
- No content jump occurs when switching transparent, solid, sticky, or open-drawer states.

### Navigation

- Women and Men mega menus render the observed link groups and configured promotion/product feature areas.
- Pages renders the six observed links.
- Desktop panel height/opacity/item animations follow the specified timings.
- Mobile nested panels slide, preserve drawer scroll position, and provide working Back and Close actions.
- All routes are sourced from Shopify navigation and resource settings rather than hard-coded product handles.

### Search/cart/account/localization

- Search and cart open right drawers with the correct responsive geometry, overlay, blur, scroll lock, and z-index.
- Search autofocuses, Escape closes it, and focus returns to the search trigger.
- Empty cart matches the observed heading/support/three-pill layout; non-empty cart updates count and totals without a full reload.
- Account icon is desktop-only; mobile Login is in the drawer.
- Country/currency is desktop header + drawer footer; language is drawer footer.

### Accessibility

- Native header and navigation landmarks are present.
- No duplicated logo accessible name.
- Every icon-only control has a unique accessible name and a target of at least 44 × 44 px.
- Every disclosure reports expanded/collapsed state.
- Dialogs expose `aria-modal`, move and trap focus, close with Escape, and restore focus.
- `aria-current="page"` remains present without forcing the hover underline into a permanent active state.
- Focus outline is 2 px `#0B61CD` with 1 px offset.
- Reduced-motion behavior passes without losing functionality.
- Keyboard-only operation can reach and use every menu, submenu, search, cart, locale, account, and announcement control.

### Quality

- Liquid and section schema pass Shopify theme validation.
- No console errors at any tested breakpoint.
- No horizontal overflow at 320 px.
- Header remains usable at 200% zoom.
- Images include responsive widths and do not cause cumulative layout shift.
- CSS and JavaScript are scoped to the section/component and do not rely on third-party libraries.

