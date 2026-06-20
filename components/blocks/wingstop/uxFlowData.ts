// Wingstop §7 UX flows — hub-and-spoke DAGs.
//
// Mirrors the Panda loyalty-QR data shape (nodes + edges, auto-laid-out by the
// renderer) so the four Wingstop ordering flows read as a real screen-to-screen
// graph instead of a linear row. Structure traced from the "WS_Usability-UX"
// Figma file (key sBVSKqdHHRnDrjE1cOv4Nc, page "Userflows"): the redesign moved
// from a LINEAR build-your-meal flow to a HUB-AND-SPOKE one where a central
// product/menu page spokes out to Flavor, Side, Drink and Upgrade, and each
// completed section returns you to that hub.
//
// type "screen" = a real captured screen (has a thumb); "event" = a branch /
// state (popup, error, "done"); "entry" = the QR/menu entry; "api" unused here.
export type WsFlowNodeType = 'entry' | 'screen' | 'event' | 'api'
export interface WsFlowNode {
  id: string
  type: WsFlowNodeType
  label: string
  role?: string
  /** Absolute path to the existing screen webp under /public/wingstop. */
  thumb?: string
}
export interface WsFlowEdge {
  from: string
  to: string
  /** dashed "return to hub" link (de-emphasised). */
  back?: boolean
}
export interface WsFlow {
  id: string
  title: string
  platform: 'mobile' | 'desktop'
  nodes: WsFlowNode[]
  edges: WsFlowEdge[]
}

export const WS_FLOWS: WsFlow[] = [
  /* ── Flow 1 · Mobile · hub-and-spoke ordering ──
     Homepage → the meal-builder hub (Product page). The hub spokes out to four
     sections — Flavors, Side, Drink, Upgrade — and each completed section
     returns to the hub before checkout. This is the redesign's core move. */
  {
    id: 'mobile-hub',
    title: 'Mobile · hub-and-spoke ordering',
    platform: 'mobile',
    nodes: [
      { id: 'home', type: 'entry', label: 'Homepage', role: 'Entry — the “15pc Meal for 2” deal opens the meal builder.', thumb: '/wingstop/mobileapp/m-product.webp' },
      { id: 'hub', type: 'screen', label: 'Build your meal', role: 'The hub. Every section — flavors, sides, drinks, upgrades — branches from this one product page and reports back to it.', thumb: '/wingstop/usability/step-1-flavors.webp' },
      // Flavor spoke
      { id: 'flavors', type: 'screen', label: 'Flavor selection', role: 'Pick from the eleven flavors; the hub tracks how many are chosen.', thumb: '/wingstop/mobileapp/m-flavors.webp' },
      { id: 'flavorqty', type: 'event', label: 'Choose up to 2', role: 'Per-flavor quantity split (e.g. 6 + 6).' },
      { id: 'flavorcustom', type: 'screen', label: 'Flavor quantities', role: 'Set the count for each chosen flavor.', thumb: '/wingstop/usability/step-1b-quantities.webp' },
      { id: 'missing', type: 'event', label: 'Missing flavors', role: 'Validation — finish assigning every wing before continuing.' },
      // Side spoke
      { id: 'side', type: 'screen', label: 'Side selection', role: 'Choose the included side.', thumb: '/wingstop/usability/step-2-side.webp' },
      { id: 'sidecustom', type: 'screen', label: 'Side customization', role: 'Customize or swap the side.', thumb: '/wingstop/mobileapp/m-customize.webp' },
      // Drink spoke
      { id: 'drink', type: 'screen', label: 'Drink selection', role: 'Pick the drink for the combo.', thumb: '/wingstop/usability/step-3-drink.webp' },
      { id: 'drinkdone', type: 'event', label: 'Drink selected', role: 'Selection confirmed; back to the hub.' },
      // Upgrade spoke
      { id: 'upgrade', type: 'screen', label: 'Upgrade', role: 'Size-up sides or add extras before review.', thumb: '/wingstop/usability/step-4-upgrade.webp' },
      { id: 'done', type: 'screen', label: 'Completed', role: 'All sections complete — order ready to review.', thumb: '/wingstop/mobileapp/m-done.webp' },
    ],
    edges: [
      { from: 'home', to: 'hub' },
      // flavor spoke + return
      { from: 'hub', to: 'flavors' },
      { from: 'flavors', to: 'flavorqty' },
      { from: 'flavorqty', to: 'flavorcustom' },
      { from: 'flavorcustom', to: 'missing' },
      { from: 'flavorcustom', to: 'hub', back: true },
      // side spoke + return
      { from: 'hub', to: 'side' },
      { from: 'side', to: 'sidecustom' },
      { from: 'sidecustom', to: 'hub', back: true },
      // drink spoke + return
      { from: 'hub', to: 'drink' },
      { from: 'drink', to: 'drinkdone' },
      { from: 'drinkdone', to: 'hub', back: true },
      // upgrade spoke → done
      { from: 'hub', to: 'upgrade' },
      { from: 'upgrade', to: 'done' },
    ],
  },

  /* ── Flow 2 · Mobile · single-page ordering ──
     The alternate model the team weighed: one long scrolling page where every
     section stacks in sequence rather than branching from a hub. */
  {
    id: 'mobile-single',
    title: 'Mobile · single-page ordering',
    platform: 'mobile',
    nodes: [
      { id: 'start', type: 'entry', label: 'Homepage', role: 'Entry — straight into the single-page builder.', thumb: '/wingstop/mobileapp/m-product.webp' },
      { id: 'flavors', type: 'screen', label: 'Choose flavors', role: 'Flavors section, inline at the top of the page.', thumb: '/wingstop/usability/step-1-flavors.webp' },
      { id: 'side', type: 'screen', label: 'Choose a side', role: 'Side section, directly below — no page change.', thumb: '/wingstop/usability/step-2-side.webp' },
      { id: 'drink', type: 'screen', label: 'Choose a drink', role: 'Drink section continues the same scroll.', thumb: '/wingstop/usability/step-3-drink.webp' },
      { id: 'upgrade', type: 'screen', label: 'Upgrade', role: 'Optional upgrades before the order is reviewed.', thumb: '/wingstop/usability/step-4-upgrade.webp' },
      { id: 'review', type: 'screen', label: 'Review order', role: 'Everything confirmed on one page.', thumb: '/wingstop/mobileapp/m-done.webp' },
    ],
    edges: [
      { from: 'start', to: 'flavors' },
      { from: 'flavors', to: 'side' },
      { from: 'side', to: 'drink' },
      { from: 'drink', to: 'upgrade' },
      { from: 'upgrade', to: 'review' },
    ],
  },
  /* ── Flow 3 · Desktop · hub-and-spoke ordering ──
     The same hub model carried to desktop: a central flavor/menu page that
     spokes out to flavor customization, side, and drink, returning each time. */
  {
    id: 'desktop-hub',
    title: 'Desktop · hub-and-spoke ordering',
    platform: 'desktop',
    nodes: [
      { id: 'hub', type: 'screen', label: 'Flavor selection', role: 'The desktop hub — the menu/flavor page every section branches from.', thumb: '/wingstop/desktopapp/d-flavors.webp' },
      { id: 'flavorcustom', type: 'screen', label: 'Flavor quantities', role: 'Assign counts per flavor, then return to the hub.', thumb: '/wingstop/desktopapp/d-flavor-custom.webp' },
      { id: 'missing', type: 'event', label: 'Missing flavors', role: 'Validation before the section can close.' },
      { id: 'side', type: 'screen', label: 'Side customization', role: 'Choose and customize the side.', thumb: '/wingstop/desktopapp/d-side.webp' },
      { id: 'drink', type: 'screen', label: 'Drink selection', role: 'Pick the drink for the combo.', thumb: '/wingstop/desktopapp/d-drink.webp' },
      { id: 'drinkdone', type: 'event', label: 'Drink selected', role: 'Selection confirmed; back to the hub.' },
    ],
    edges: [
      { from: 'hub', to: 'flavorcustom' },
      { from: 'flavorcustom', to: 'missing' },
      { from: 'flavorcustom', to: 'hub', back: true },
      { from: 'hub', to: 'side' },
      { from: 'side', to: 'hub', back: true },
      { from: 'hub', to: 'drink' },
      { from: 'drink', to: 'drinkdone' },
      { from: 'drinkdone', to: 'hub', back: true },
    ],
  },
  /* ── Flow 4 · Desktop · single-page ordering ──
     The desktop linear counterpart — the staged group-packs page, section by
     section down one long view. */
  {
    id: 'desktop-single',
    title: 'Desktop · single-page ordering',
    platform: 'desktop',
    nodes: [
      { id: 'menu', type: 'entry', label: 'Menu', role: 'Entry — the group-packs page.', thumb: '/wingstop/desktopapp/d-flavors.webp' },
      { id: 'customize', type: 'screen', label: 'Customize', role: 'Flavor customization inline on the page.', thumb: '/wingstop/desktopapp/d-flavor-custom.webp' },
      { id: 'drink', type: 'screen', label: 'Drink', role: 'Drink section continues down the page.', thumb: '/wingstop/desktopapp/d-drink.webp' },
      { id: 'upgrade', type: 'screen', label: 'Upgrade side', role: 'Size-up the side to finish the order.', thumb: '/wingstop/desktopapp/d-side.webp' },
    ],
    edges: [
      { from: 'menu', to: 'customize' },
      { from: 'customize', to: 'drink' },
      { from: 'drink', to: 'upgrade' },
    ],
  },
]
