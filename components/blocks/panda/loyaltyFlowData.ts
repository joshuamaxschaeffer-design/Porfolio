// AUTO-GENERATED from the Loyalty-QR-Enrollment Figma file.
// 6 flows grouped by the canvas clusters (the gray boxes + free regions the
// designer drew). Screens keyed by NODE ID (same-named frames are distinct
// screens). type "event" = a branch/decision; "api" = a backend call (Cache /
// Azure / mParticle / Punchh / Firebase). Design notes are intentionally excluded.
export type FlowNodeType = "entry" | "screen" | "event" | "api"
export interface FlowNode { id: string; type: FlowNodeType; label: string; role?: string; thumb?: string; detail?: string; nx: number; ny: number }
export interface FlowEdge { from: string; to: string; api?: boolean }
export interface Flow { id: string; title: string; blurb: string; platform: "mobile" | "mobile-web" | "desktop" | "mixed"; nodes: FlowNode[]; edges: FlowEdge[] }
export const FLOWS: Flow[] = [
  {
    "id": "flow7",
    "title": "Flow 7 · Mobile · receipt scan",
    "blurb": "Native-app receipt scan into sign-in, confirmation, the join gate and rewards.",
    "platform": "mobile",
    "nodes": [
      {
        "id": "0:18697",
        "type": "event",
        "label": "If App",
        "role": "If App — branch.",
        "nx": 0.169,
        "ny": 0.076
      },
      {
        "id": "0:18751",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry point.",
        "nx": 0,
        "ny": 0.081
      },
      {
        "id": "0:18768",
        "type": "event",
        "label": "Loading",
        "role": "Loading — branch.",
        "nx": 0.249,
        "ny": 0.133
      },
      {
        "id": "0:18777",
        "type": "event",
        "label": "Logged In",
        "role": "Logged In — branch.",
        "nx": 0.353,
        "ny": 0.448
      },
      {
        "id": "0:18792",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.786,
        "ny": 0.788
      },
      {
        "id": "0:18798",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.78,
        "ny": 0.583
      },
      {
        "id": "0:18804",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.721,
        "ny": 0.248
      },
      {
        "id": "0:18816",
        "type": "event",
        "label": "Guest",
        "role": "Guest — branch.",
        "nx": 0.353,
        "ny": 0.076
      },
      {
        "id": "0:18820",
        "type": "event",
        "label": "Sign in",
        "role": "Sign in — branch.",
        "nx": 0.911,
        "ny": 0.113
      },
      {
        "id": "0:18831",
        "type": "event",
        "label": "If Loyalty",
        "role": "If Loyalty — branch.",
        "nx": 0.476,
        "ny": 0.698
      },
      {
        "id": "0:18835",
        "type": "event",
        "label": "Not Loyalty",
        "role": "Not Loyalty — branch.",
        "nx": 0.476,
        "ny": 0.463
      },
      {
        "id": "0:19206",
        "type": "screen",
        "label": "Thanks for scanning",
        "role": "Post-scan confirmation — points added shortly.",
        "thumb": "0-19206",
        "nx": 0.721,
        "ny": 0.504
      },
      {
        "id": "0:19424",
        "type": "screen",
        "label": "Sign in",
        "role": "Good Fortune is a tap away — FB/Google/Apple/email.",
        "thumb": "0-19424",
        "nx": 0.794,
        "ny": 0.086
      },
      {
        "id": "0:20223",
        "type": "screen",
        "label": "Join Panda Rewards",
        "role": "Loyalty gate — join or continue as guest.",
        "thumb": "0-20223",
        "nx": 0.927,
        "ny": 0.504
      },
      {
        "id": "0:20485",
        "type": "screen",
        "label": "Logged-out dish",
        "role": "Crispy Almond detail — logged out.",
        "thumb": "0-20485",
        "nx": 1,
        "ny": 0.504
      },
      {
        "id": "0:20707",
        "type": "screen",
        "label": "Rewards dashboard",
        "role": "567 Good Fortune Points + Scan tab.",
        "thumb": "0-20707",
        "nx": 0.721,
        "ny": 1
      },
      {
        "id": "46:13281",
        "type": "screen",
        "label": "How it works",
        "role": "Benefits — 10 pts/$1, monthly gift, birthday, offers.",
        "thumb": "46-13281",
        "nx": 0.85,
        "ny": 0.504
      },
      {
        "id": "37:16908",
        "type": "api",
        "label": "Punchh",
        "role": "Punchh associates the scanned transaction to the logged-in user so the points are credited.",
        "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited.",
        "nx": 0.721,
        "ny": 0.692
      },
      {
        "id": "0:20761",
        "type": "api",
        "label": "Firebase",
        "role": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "detail": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "nx": 0.088,
        "ny": 0
      }
    ],
    "edges": [
      {
        "from": "0:18697",
        "to": "0:18768"
      },
      {
        "from": "0:18751",
        "to": "0:18697"
      },
      {
        "from": "0:18777",
        "to": "0:18835"
      },
      {
        "from": "0:18777",
        "to": "0:18831"
      },
      {
        "from": "0:18816",
        "to": "0:19424"
      },
      {
        "from": "0:18820",
        "to": "0:20707"
      },
      {
        "from": "0:18831",
        "to": "0:20707"
      },
      {
        "from": "0:18835",
        "to": "0:19206"
      },
      {
        "from": "0:19206",
        "to": "0:20223"
      },
      {
        "from": "0:19424",
        "to": "0:18820"
      },
      {
        "from": "0:20223",
        "to": "0:20707"
      },
      {
        "from": "0:20223",
        "to": "0:20485"
      },
      {
        "from": "0:18768",
        "to": "0:18816"
      },
      {
        "from": "0:18768",
        "to": "0:18777"
      },
      {
        "from": "0:18798",
        "to": "37:16908",
        "api": true
      },
      {
        "from": "0:18697",
        "to": "0:20761",
        "api": true
      }
    ]
  },
  {
    "id": "flow2",
    "title": "Flow 2 · Mobile · location & pilot gating",
    "blurb": "Mobile tabletop entry with full location + pilot gating before enrollment.",
    "platform": "mobile",
    "nodes": [
      {
        "id": "0:18694",
        "type": "event",
        "label": "If App",
        "role": "If App — branch.",
        "nx": 0.08,
        "ny": 0.257
      },
      {
        "id": "0:18748",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry point.",
        "nx": 0,
        "ny": 0.257
      },
      {
        "id": "0:18757",
        "type": "event",
        "label": "Non Loyalty",
        "role": "Non Loyalty — branch.",
        "nx": 0.151,
        "ny": 0.257
      },
      {
        "id": "0:18761",
        "type": "event",
        "label": "Location known",
        "role": "Location known — branch.",
        "nx": 0.268,
        "ny": 0.182
      },
      {
        "id": "0:18763",
        "type": "event",
        "label": "Loading",
        "role": "Loading — branch.",
        "nx": 0.457,
        "ny": 0.178
      },
      {
        "id": "0:18773",
        "type": "event",
        "label": "Not Pilot",
        "role": "Not Pilot — branch.",
        "nx": 0.549,
        "ny": 0.125
      },
      {
        "id": "0:18775",
        "type": "event",
        "label": "Logged In",
        "role": "Logged In — branch.",
        "nx": 0.648,
        "ny": 0.581
      },
      {
        "id": "0:18783",
        "type": "event",
        "label": "Pilot",
        "role": "Pilot — branch.",
        "nx": 0.549,
        "ny": 0.315
      },
      {
        "id": "0:18814",
        "type": "event",
        "label": "Guest",
        "role": "Guest — branch.",
        "nx": 0.648,
        "ny": 0.289
      },
      {
        "id": "37:16823",
        "type": "event",
        "label": "Correct ZIP",
        "role": "Correct ZIP — branch.",
        "nx": 0.703,
        "ny": 0.178
      },
      {
        "id": "0:18824",
        "type": "event",
        "label": "Location unknown",
        "role": "Location unknown — branch.",
        "nx": 0.268,
        "ny": 0.369
      },
      {
        "id": "0:18827",
        "type": "event",
        "label": "Location blocked",
        "role": "Location blocked — branch.",
        "nx": 0.268,
        "ny": 0.591
      },
      {
        "id": "0:18829",
        "type": "event",
        "label": "If Loyalty",
        "role": "If Loyalty — branch.",
        "nx": 0.151,
        "ny": 0.731
      },
      {
        "id": "0:18839",
        "type": "screen",
        "label": "Confirm location",
        "role": "Share location or enter ZIP.",
        "thumb": "0-18839",
        "nx": 0.367,
        "ny": 0.654
      },
      {
        "id": "0:18902",
        "type": "screen",
        "label": "Location permission",
        "role": "Native iOS location prompt.",
        "thumb": "0-18902",
        "nx": 0.367,
        "ny": 0.412
      },
      {
        "id": "0:18989",
        "type": "screen",
        "label": "Welcome",
        "role": "Welcome modal — Get Started (logged-in).",
        "thumb": "0-18989",
        "nx": 0.748,
        "ny": 0.624
      },
      {
        "id": "0:19793",
        "type": "screen",
        "label": "Welcome (Sign in)",
        "role": "Welcome modal — Sign In variant.",
        "thumb": "0-19793",
        "nx": 0.748,
        "ny": 0.329
      },
      {
        "id": "39:13612",
        "type": "screen",
        "label": "Welcome (Sign in)",
        "role": "Welcome modal — Sign In variant.",
        "thumb": "39-13612",
        "nx": 0.903,
        "ny": 0
      },
      {
        "id": "39:13106",
        "type": "screen",
        "label": "Rewards Coming Soon",
        "role": "Non-pilot — email capture.",
        "thumb": "39-13106",
        "nx": 0.808,
        "ny": 0
      },
      {
        "id": "39:13827",
        "type": "screen",
        "label": "Coming Soon (sent)",
        "role": "Email entered confirmation.",
        "thumb": "39-13827",
        "nx": 1,
        "ny": 0
      },
      {
        "id": "39:13395",
        "type": "screen",
        "label": "Enter ZIP",
        "role": "Find another location.",
        "thumb": "39-13395",
        "nx": 0.855,
        "ny": 0
      },
      {
        "id": "0:20653",
        "type": "screen",
        "label": "Rewards dashboard",
        "role": "567 Good Fortune Points + Scan tab.",
        "thumb": "0-20653",
        "nx": 0.748,
        "ny": 1
      },
      {
        "id": "0:45683",
        "type": "api",
        "label": "Firebase",
        "role": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "detail": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "nx": 0.042,
        "ny": 0.206
      }
    ],
    "edges": [
      {
        "from": "0:18694",
        "to": "0:18757"
      },
      {
        "from": "0:18839",
        "to": "0:18902"
      },
      {
        "from": "0:18748",
        "to": "0:18694"
      },
      {
        "from": "0:18757",
        "to": "0:18761"
      },
      {
        "from": "0:18757",
        "to": "0:18824"
      },
      {
        "from": "0:18757",
        "to": "0:18827"
      },
      {
        "from": "0:18761",
        "to": "0:18763"
      },
      {
        "from": "0:18763",
        "to": "0:18773"
      },
      {
        "from": "0:18763",
        "to": "0:18783"
      },
      {
        "from": "0:18775",
        "to": "0:18989"
      },
      {
        "from": "0:18783",
        "to": "0:18814"
      },
      {
        "from": "0:18783",
        "to": "0:18775"
      },
      {
        "from": "0:18814",
        "to": "0:19793"
      },
      {
        "from": "37:16823",
        "to": "0:19793"
      },
      {
        "from": "0:18824",
        "to": "0:18902"
      },
      {
        "from": "0:18827",
        "to": "0:18839"
      },
      {
        "from": "0:18829",
        "to": "0:20653"
      },
      {
        "from": "0:18839",
        "to": "0:18763"
      },
      {
        "from": "0:18902",
        "to": "0:18763"
      },
      {
        "from": "39:13395",
        "to": "37:16823"
      },
      {
        "from": "0:18694",
        "to": "0:18829"
      },
      {
        "from": "0:18694",
        "to": "0:45683",
        "api": true
      }
    ]
  },
  {
    "id": "flow3",
    "title": "Flow 3 · Desktop · location & pilot gating",
    "blurb": "Desktop tabletop entry: location, pilot check, then enroll or “Rewards Coming Soon.”",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:2",
        "type": "screen",
        "label": "Confirm location",
        "role": "Share location / enter ZIP (desktop).",
        "thumb": "0-2",
        "nx": 0.382,
        "ny": 0.521
      },
      {
        "id": "0:77",
        "type": "screen",
        "label": "Loading",
        "role": "Good Fortune Awaits splash (desktop).",
        "thumb": "0-77",
        "nx": 0.506,
        "ny": 0.275
      },
      {
        "id": "47:13079",
        "type": "screen",
        "label": "Loading",
        "role": "Good Fortune Awaits splash (desktop).",
        "thumb": "47-13079",
        "nx": 0.137,
        "ny": 0.337
      },
      {
        "id": "0:126",
        "type": "screen",
        "label": "Location permission",
        "role": "Browser geolocation prompt (desktop).",
        "thumb": "0-126",
        "nx": 0.382,
        "ny": 0.369
      },
      {
        "id": "0:201",
        "type": "screen",
        "label": "Earn Points Get Panda",
        "role": "Join hero + How It Works + Get App (desktop).",
        "thumb": "0-201",
        "nx": 0.774,
        "ny": 0.434
      },
      {
        "id": "4:5994",
        "type": "screen",
        "label": "Earn Points Get Panda",
        "role": "Join hero (desktop, Our Rewards tab).",
        "thumb": "4-5994",
        "nx": 0.774,
        "ny": 0.698
      },
      {
        "id": "10:11439",
        "type": "screen",
        "label": "Rewards Coming Soon",
        "role": "Non-pilot email capture (desktop, prefilled).",
        "thumb": "10-11439",
        "nx": 0.774,
        "ny": 0
      },
      {
        "id": "94:13280",
        "type": "screen",
        "label": "Rewards Coming Soon",
        "role": "Non-pilot email capture (desktop, empty).",
        "thumb": "94-13280",
        "nx": 0.774,
        "ny": 0.177
      },
      {
        "id": "10:13646",
        "type": "screen",
        "label": "Coming Soon (4th & Everett)",
        "role": "Non-pilot email capture (desktop).",
        "thumb": "10-13646",
        "nx": 1,
        "ny": 0.141
      },
      {
        "id": "10:12834",
        "type": "screen",
        "label": "Enter ZIP",
        "role": "Find another location (desktop).",
        "thumb": "10-12834",
        "nx": 0.898,
        "ny": 0.141
      },
      {
        "id": "0:14982",
        "type": "event",
        "label": "Non Loyalty",
        "role": "Non Loyalty — branch.",
        "nx": 0.216,
        "ny": 0.324
      },
      {
        "id": "0:14986",
        "type": "event",
        "label": "If Web",
        "role": "If Web — branch.",
        "nx": 0.059,
        "ny": 0.324
      },
      {
        "id": "0:14989",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry point.",
        "nx": 0,
        "ny": 0.324
      },
      {
        "id": "0:14992",
        "type": "event",
        "label": "Location known",
        "role": "Location known — branch.",
        "nx": 0.281,
        "ny": 0.275
      },
      {
        "id": "0:14995",
        "type": "event",
        "label": "Location unknown",
        "role": "Location unknown — branch.",
        "nx": 0.281,
        "ny": 0.38
      },
      {
        "id": "0:14998",
        "type": "event",
        "label": "Location blocked",
        "role": "Location blocked — branch.",
        "nx": 0.281,
        "ny": 0.531
      },
      {
        "id": "0:15000",
        "type": "event",
        "label": "If Pilot",
        "role": "If Pilot — branch.",
        "nx": 0.596,
        "ny": 0.329
      },
      {
        "id": "0:15004",
        "type": "event",
        "label": "Not Pilot",
        "role": "Not Pilot — branch.",
        "nx": 0.596,
        "ny": 0.208
      },
      {
        "id": "0:15009",
        "type": "event",
        "label": "Guest",
        "role": "Guest — branch.",
        "nx": 0.648,
        "ny": 0.208
      },
      {
        "id": "0:15013",
        "type": "event",
        "label": "Logged-in non-member",
        "role": "Logged-in non-member — branch.",
        "nx": 0.648,
        "ny": 0.055
      },
      {
        "id": "0:15017",
        "type": "event",
        "label": "If Guest",
        "role": "If Guest — branch.",
        "nx": 0.648,
        "ny": 0.329
      },
      {
        "id": "0:15019",
        "type": "event",
        "label": "If Logged In",
        "role": "If Logged In — branch.",
        "nx": 0.648,
        "ny": 0.561
      },
      {
        "id": "0:15021",
        "type": "screen",
        "label": "Rewards page",
        "role": "367 points education hub.",
        "thumb": "0-15021",
        "nx": 0.774,
        "ny": 1
      },
      {
        "id": "0:18692",
        "type": "event",
        "label": "If Loyalty",
        "role": "If Loyalty — branch.",
        "nx": 0.216,
        "ny": 0.626
      },
      {
        "id": "0:18787",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.836,
        "ny": 0.116
      },
      {
        "id": "0:18790",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.83,
        "ny": 0.683
      },
      {
        "id": "0:45684",
        "type": "api",
        "label": "Firebase",
        "role": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "detail": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "nx": 0.036,
        "ny": 0.304
      }
    ],
    "edges": [
      {
        "from": "0:77",
        "to": "0:15004"
      },
      {
        "from": "0:14982",
        "to": "0:14992"
      },
      {
        "from": "0:2",
        "to": "0:77"
      },
      {
        "from": "47:13079",
        "to": "0:18692"
      },
      {
        "from": "0:126",
        "to": "0:77"
      },
      {
        "from": "0:14982",
        "to": "0:14998"
      },
      {
        "from": "0:14982",
        "to": "0:14995"
      },
      {
        "from": "0:14986",
        "to": "47:13079"
      },
      {
        "from": "0:14989",
        "to": "0:14986"
      },
      {
        "from": "0:14992",
        "to": "0:77"
      },
      {
        "from": "0:14995",
        "to": "0:126"
      },
      {
        "from": "0:14998",
        "to": "0:2"
      },
      {
        "from": "0:15000",
        "to": "0:15017"
      },
      {
        "from": "0:15000",
        "to": "0:15019"
      },
      {
        "from": "0:15004",
        "to": "0:15009"
      },
      {
        "from": "0:15004",
        "to": "0:15013"
      },
      {
        "from": "0:15009",
        "to": "94:13280"
      },
      {
        "from": "0:15013",
        "to": "10:11439"
      },
      {
        "from": "0:15017",
        "to": "0:201"
      },
      {
        "from": "0:15019",
        "to": "4:5994"
      },
      {
        "from": "0:18692",
        "to": "0:15021"
      },
      {
        "from": "0:77",
        "to": "0:15000"
      },
      {
        "from": "47:13079",
        "to": "0:14982"
      },
      {
        "from": "0:14986",
        "to": "0:45684",
        "api": true
      }
    ]
  },
  {
    "id": "flow4",
    "title": "Flow 4 · Desktop · receipt scan",
    "blurb": "Desktop receipt scan: sign-in, post-scan confirmation, How-It-Works, join gate.",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:16855",
        "type": "screen",
        "label": "Rewards page",
        "role": "367 points education + How to Collect + Get App.",
        "thumb": "0-16855",
        "nx": 0.571,
        "ny": 1
      },
      {
        "id": "0:18699",
        "type": "event",
        "label": "If Web",
        "role": "If Web — branch.",
        "nx": 0.1,
        "ny": 0.041
      },
      {
        "id": "0:18701",
        "type": "screen",
        "label": "Loading",
        "role": "Good Fortune Awaits splash (desktop).",
        "thumb": "0-18701",
        "nx": 0.219,
        "ny": 0.063
      },
      {
        "id": "0:18754",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry point.",
        "nx": 0,
        "ny": 0.043
      },
      {
        "id": "0:18780",
        "type": "event",
        "label": "Logged In",
        "role": "Logged In — branch.",
        "nx": 0.354,
        "ny": 0.324
      },
      {
        "id": "0:18795",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.652,
        "ny": 0.779
      },
      {
        "id": "0:18801",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.652,
        "ny": 0.298
      },
      {
        "id": "0:18809",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.524,
        "ny": 0.18
      },
      {
        "id": "0:18818",
        "type": "event",
        "label": "Guest",
        "role": "Guest — branch.",
        "nx": 0.354,
        "ny": 0.053
      },
      {
        "id": "0:18822",
        "type": "event",
        "label": "Sign in",
        "role": "Sign in — branch.",
        "nx": 0.85,
        "ny": 0.053
      },
      {
        "id": "0:18833",
        "type": "event",
        "label": "If Loyalty",
        "role": "If Loyalty — branch.",
        "nx": 0.427,
        "ny": 0.459
      },
      {
        "id": "0:18837",
        "type": "event",
        "label": "Not Loyalty",
        "role": "Not Loyalty — branch.",
        "nx": 0.427,
        "ny": 0.333
      },
      {
        "id": "0:19522",
        "type": "screen",
        "label": "Sign in",
        "role": "Good Fortune is a tap away (desktop).",
        "thumb": "0-19522",
        "nx": 0.712,
        "ny": 0.082
      },
      {
        "id": "0:26985",
        "type": "screen",
        "label": "Thanks for scanning",
        "role": "Post-scan confirmation (desktop).",
        "thumb": "0-26985",
        "nx": 0.571,
        "ny": 0.349
      },
      {
        "id": "0:33219",
        "type": "screen",
        "label": "Join Panda Rewards",
        "role": "Loyalty gate (desktop).",
        "thumb": "0-33219",
        "nx": 0.867,
        "ny": 0.349
      },
      {
        "id": "0:39498",
        "type": "screen",
        "label": "Logged-out home",
        "role": "Crispy Almond hero / We Wok For You (desktop).",
        "thumb": "0-39498",
        "nx": 1,
        "ny": 0.362
      },
      {
        "id": "47:13309",
        "type": "screen",
        "label": "How it works",
        "role": "Benefits modal (desktop).",
        "thumb": "47-13309",
        "nx": 0.736,
        "ny": 0.349
      },
      {
        "id": "37:17265",
        "type": "api",
        "label": "Punchh",
        "role": "Punchh associates the scanned transaction to the logged-in user so the points are credited.",
        "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited.",
        "nx": 0.542,
        "ny": 0.254
      },
      {
        "id": "0:20762",
        "type": "api",
        "label": "Firebase",
        "role": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "detail": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "nx": 0.052,
        "ny": 0
      }
    ],
    "edges": [
      {
        "from": "0:18701",
        "to": "0:18818"
      },
      {
        "from": "0:18780",
        "to": "0:18837"
      },
      {
        "from": "0:18699",
        "to": "0:18701"
      },
      {
        "from": "0:18754",
        "to": "0:18699"
      },
      {
        "from": "0:18818",
        "to": "0:19522"
      },
      {
        "from": "0:18822",
        "to": "0:16855"
      },
      {
        "from": "0:18833",
        "to": "0:16855"
      },
      {
        "from": "0:18837",
        "to": "0:26985"
      },
      {
        "from": "0:19522",
        "to": "0:18822"
      },
      {
        "from": "0:26985",
        "to": "0:33219"
      },
      {
        "from": "0:33219",
        "to": "0:16855"
      },
      {
        "from": "0:33219",
        "to": "0:39498"
      },
      {
        "from": "0:18701",
        "to": "0:18780"
      },
      {
        "from": "0:18780",
        "to": "0:18833"
      },
      {
        "from": "0:18809",
        "to": "37:17265",
        "api": true
      },
      {
        "from": "0:18699",
        "to": "0:20762",
        "api": true
      }
    ]
  },
  {
    "id": "flow6",
    "title": "Flow 6 · Mobile web · location & pilot gating",
    "blurb": "Mobile-web tabletop entry: location, pilot check, then enroll or “Rewards Coming Soon.”",
    "platform": "mobile-web",
    "nodes": [
      {
        "id": "4:14178",
        "type": "screen",
        "label": "Rewards Coming Soon",
        "role": "Non-pilot email capture (mobile web).",
        "thumb": "4-14178",
        "nx": 0.913,
        "ny": 0.013
      },
      {
        "id": "33:14234",
        "type": "screen",
        "label": "Coming Soon (4th & Everett)",
        "role": "Email filled (mobile web).",
        "thumb": "33-14234",
        "nx": 1,
        "ny": 0.013
      },
      {
        "id": "33:13867",
        "type": "screen",
        "label": "Enter ZIP",
        "role": "Find another location (mobile web).",
        "thumb": "33-13867",
        "nx": 0.956,
        "ny": 0
      },
      {
        "id": "4:29792",
        "type": "screen",
        "label": "Loading",
        "role": "Good Fortune Awaits splash (mobile web).",
        "thumb": "4-29792",
        "nx": 0.541,
        "ny": 0.303
      },
      {
        "id": "4:30146",
        "type": "screen",
        "label": "Confirm location",
        "role": "Share location / enter ZIP (mobile web).",
        "thumb": "4-30146",
        "nx": 0.351,
        "ny": 0.595
      },
      {
        "id": "4:83983",
        "type": "screen",
        "label": "Location permission",
        "role": "Native location prompt (mobile web).",
        "thumb": "4-83983",
        "nx": 0.351,
        "ny": 0.416
      },
      {
        "id": "4:14721",
        "type": "screen",
        "label": "Rewards landing",
        "role": "Earn Points Get Panda + How It Works + Get App.",
        "thumb": "4-14721",
        "nx": 0.913,
        "ny": 0.38
      },
      {
        "id": "4:21959",
        "type": "screen",
        "label": "Earn Points Get Panda",
        "role": "Join hero (mobile web).",
        "thumb": "4-21959",
        "nx": 0.913,
        "ny": 0.729
      },
      {
        "id": "4:44449",
        "type": "event",
        "label": "Non Loyalty",
        "role": "Non Loyalty — branch.",
        "nx": 0.122,
        "ny": 0.367
      },
      {
        "id": "4:44455",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry point.",
        "nx": 0.065,
        "ny": 0.367
      },
      {
        "id": "4:44459",
        "type": "event",
        "label": "If App/Web",
        "role": "If App/Web — branch.",
        "nx": 0,
        "ny": 0.367
      },
      {
        "id": "4:44462",
        "type": "event",
        "label": "Location known",
        "role": "Location known — branch.",
        "nx": 0.217,
        "ny": 0.316
      },
      {
        "id": "4:44465",
        "type": "event",
        "label": "Location unknown",
        "role": "Location unknown — branch.",
        "nx": 0.217,
        "ny": 0.424
      },
      {
        "id": "4:44468",
        "type": "event",
        "label": "Location blocked",
        "role": "Location blocked — branch.",
        "nx": 0.217,
        "ny": 0.579
      },
      {
        "id": "4:44470",
        "type": "event",
        "label": "If Pilot",
        "role": "If Pilot — branch.",
        "nx": 0.672,
        "ny": 0.372
      },
      {
        "id": "4:44475",
        "type": "event",
        "label": "Not Pilot",
        "role": "Not Pilot — branch.",
        "nx": 0.672,
        "ny": 0.248
      },
      {
        "id": "4:44481",
        "type": "event",
        "label": "Guest",
        "role": "Guest — branch.",
        "nx": 0.747,
        "ny": 0.248
      },
      {
        "id": "4:44485",
        "type": "event",
        "label": "Logged-in non-member",
        "role": "Logged-in non-member — branch.",
        "nx": 0.747,
        "ny": 0.144
      },
      {
        "id": "4:44489",
        "type": "event",
        "label": "If Guest",
        "role": "If Guest — branch.",
        "nx": 0.747,
        "ny": 0.372
      },
      {
        "id": "4:44491",
        "type": "event",
        "label": "If Logged In",
        "role": "If Logged In — branch.",
        "nx": 0.747,
        "ny": 0.609
      },
      {
        "id": "4:46329",
        "type": "event",
        "label": "If Loyalty",
        "role": "If Loyalty — branch.",
        "nx": 0.122,
        "ny": 0.675
      },
      {
        "id": "4:46331",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.956,
        "ny": 0.113
      },
      {
        "id": "4:46334",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.963,
        "ny": 0.708
      },
      {
        "id": "4:48128",
        "type": "screen",
        "label": "Rewards dashboard",
        "role": "567 Good Fortune Points.",
        "thumb": "4-48128",
        "nx": 0.913,
        "ny": 1
      },
      {
        "id": "4:46336",
        "type": "api",
        "label": "Firebase",
        "role": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "detail": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "nx": 0.032,
        "ny": 0.346
      }
    ],
    "edges": [
      {
        "from": "4:29792",
        "to": "4:44475"
      },
      {
        "from": "4:83983",
        "to": "4:29792"
      },
      {
        "from": "4:44449",
        "to": "4:44462"
      },
      {
        "from": "4:44449",
        "to": "4:44468"
      },
      {
        "from": "4:44449",
        "to": "4:44465"
      },
      {
        "from": "4:44455",
        "to": "4:44449"
      },
      {
        "from": "4:44455",
        "to": "4:46329"
      },
      {
        "from": "4:44459",
        "to": "4:44455"
      },
      {
        "from": "4:44462",
        "to": "4:29792"
      },
      {
        "from": "4:44465",
        "to": "4:83983"
      },
      {
        "from": "4:44468",
        "to": "4:30146"
      },
      {
        "from": "4:44470",
        "to": "4:44489"
      },
      {
        "from": "4:44470",
        "to": "4:44491"
      },
      {
        "from": "4:44475",
        "to": "4:44481"
      },
      {
        "from": "4:44475",
        "to": "4:44485"
      },
      {
        "from": "4:44481",
        "to": "4:14721"
      },
      {
        "from": "4:44485",
        "to": "4:14178"
      },
      {
        "from": "4:44489",
        "to": "4:14721"
      },
      {
        "from": "4:44491",
        "to": "4:21959"
      },
      {
        "from": "4:46329",
        "to": "4:48128"
      },
      {
        "from": "4:29792",
        "to": "4:44470"
      },
      {
        "from": "4:44459",
        "to": "4:46336",
        "api": true
      }
    ]
  },
  {
    "id": "flow8",
    "title": "Out of range · Mobile",
    "blurb": "The out-of-range path: post-scan confirmation, join gate and fallback when not near a pilot store.",
    "platform": "mobile",
    "nodes": [
      {
        "id": "4:52475",
        "type": "screen",
        "label": "Loading",
        "role": "Good Fortune Awaits splash (Safari).",
        "thumb": "4-52475",
        "nx": 0.27,
        "ny": 0.135
      },
      {
        "id": "4:49717",
        "type": "event",
        "label": "If App/Web",
        "role": "If App/Web — branch.",
        "nx": 0.183,
        "ny": 0.076
      },
      {
        "id": "4:49720",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry point.",
        "nx": 0,
        "ny": 0.081
      },
      {
        "id": "4:49730",
        "type": "event",
        "label": "Logged In",
        "role": "Logged In — branch.",
        "nx": 0.383,
        "ny": 0.448
      },
      {
        "id": "4:49734",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.852,
        "ny": 0.788
      },
      {
        "id": "4:49737",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.846,
        "ny": 0.583
      },
      {
        "id": "4:49740",
        "type": "event",
        "label": "Artboard",
        "role": "Artboard — branch.",
        "nx": 0.852,
        "ny": 0.256
      },
      {
        "id": "4:49745",
        "type": "event",
        "label": "Guest",
        "role": "Guest — branch.",
        "nx": 0.383,
        "ny": 0.063
      },
      {
        "id": "4:49747",
        "type": "event",
        "label": "Sign in",
        "role": "Sign in — branch.",
        "nx": 0.988,
        "ny": 0.113
      },
      {
        "id": "4:49749",
        "type": "event",
        "label": "If Loyalty",
        "role": "If Loyalty — branch.",
        "nx": 0.517,
        "ny": 0.698
      },
      {
        "id": "4:49751",
        "type": "event",
        "label": "Not Loyalty",
        "role": "Not Loyalty — branch.",
        "nx": 0.517,
        "ny": 0.463
      },
      {
        "id": "4:49963",
        "type": "screen",
        "label": "Sign in",
        "role": "Sign in (mobile web Safari).",
        "thumb": "4-49963",
        "nx": 0.786,
        "ny": 0.113
      },
      {
        "id": "4:50725",
        "type": "screen",
        "label": "Rewards dashboard",
        "role": "567 Good Fortune Points (out-of-range exit).",
        "thumb": "4-50725",
        "nx": 0.782,
        "ny": 1
      },
      {
        "id": "4:58910",
        "type": "screen",
        "label": "Thanks for scanning",
        "role": "Post-scan confirmation (out-of-range).",
        "thumb": "4-58910",
        "nx": 0.782,
        "ny": 0.5
      },
      {
        "id": "4:71365",
        "type": "screen",
        "label": "Join Panda Rewards",
        "role": "Loyalty gate — join or continue as guest.",
        "thumb": "4-71365",
        "nx": 0.916,
        "ny": 0.5
      },
      {
        "id": "4:77761",
        "type": "screen",
        "label": "Logged-out menu",
        "role": "We Wok For You — meal types.",
        "thumb": "4-77761",
        "nx": 1,
        "ny": 0.611
      },
      {
        "id": "4:50779",
        "type": "api",
        "label": "Firebase",
        "role": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "detail": "Firebase redirects route the scanned QR to the right enrollment entry.",
        "nx": 0.096,
        "ny": 0
      }
    ],
    "edges": [
      {
        "from": "4:52475",
        "to": "4:49730"
      },
      {
        "from": "4:52475",
        "to": "4:49745"
      },
      {
        "from": "4:49717",
        "to": "4:52475"
      },
      {
        "from": "4:49720",
        "to": "4:49717"
      },
      {
        "from": "4:49730",
        "to": "4:49751"
      },
      {
        "from": "4:49730",
        "to": "4:49749"
      },
      {
        "from": "4:49745",
        "to": "4:49963"
      },
      {
        "from": "4:49747",
        "to": "4:50725"
      },
      {
        "from": "4:49749",
        "to": "4:50725"
      },
      {
        "from": "4:49751",
        "to": "4:58910"
      },
      {
        "from": "4:49963",
        "to": "4:49747"
      },
      {
        "from": "4:58910",
        "to": "4:71365"
      },
      {
        "from": "4:71365",
        "to": "4:50725"
      },
      {
        "from": "4:71365",
        "to": "4:77761"
      },
      {
        "from": "4:49717",
        "to": "4:50779",
        "api": true
      }
    ]
  }
]
