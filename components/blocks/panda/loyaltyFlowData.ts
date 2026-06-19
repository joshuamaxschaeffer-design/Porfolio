// AUTO-GENERATED from the Loyalty-QR-Enrollment Figma file.
// 6 prototype flows grouped by the file's own flowStartingPoints (Flow 2-7),
// using reachability from each flow start (NOT connected components — Flow 5
// overlaps Flow 4, which is why a component-based grouping wrongly merged them).
export type FlowNodeType = "entry" | "screen" | "decision" | "api" | "note"
export interface FlowNote { kind: "api" | "note"; label: string; detail: string }
export interface FlowNode { id: string; type: FlowNodeType; label: string; role?: string; thumb?: string; detail?: string; notes?: FlowNote[]; nx: number; ny: number }
export interface FlowEdge { from: string; to: string; label?: string }
export interface Flow { id: string; title: string; blurb: string; platform: "mobile" | "mobile-web" | "desktop" | "mixed"; nodes: FlowNode[]; edges: FlowEdge[] }
export const FLOWS: Flow[] = [
  {
    "id": "flow2",
    "title": "Flow 2 · Mobile · location & pilot gating",
    "blurb": "Mobile tabletop entry with full location + pilot gating before enrollment.",
    "platform": "mobile",
    "nodes": [
      {
        "id": "0:18748",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry — scanning a QR at the table.",
        "nx": 0,
        "ny": 0.185
      },
      {
        "id": "0:18694",
        "type": "decision",
        "label": "If App",
        "role": "Branch — opened the native app?",
        "nx": 0.107,
        "ny": 0.185
      },
      {
        "id": "0:18757",
        "type": "decision",
        "label": "Non Loyalty",
        "role": "Branch — not a loyalty member.",
        "nx": 0.202,
        "ny": 0.185
      },
      {
        "id": "0:18829",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a member.",
        "nx": 0.202,
        "ny": 0.851
      },
      {
        "id": "0:18761",
        "type": "decision",
        "label": "Location known",
        "role": "Branch — is location known?",
        "nx": 0.358,
        "ny": 0.08
      },
      {
        "id": "0:18824",
        "type": "decision",
        "label": "Location unknown",
        "role": "Branch — location not yet known.",
        "nx": 0.358,
        "ny": 0.343
      },
      {
        "id": "0:18827",
        "type": "decision",
        "label": "Location blocked",
        "role": "Branch — permission denied; fall back to ZIP.",
        "nx": 0.358,
        "ny": 0.654
      },
      {
        "id": "0:20653",
        "type": "screen",
        "label": "Rewards",
        "thumb": "rewards",
        "role": "The payoff — Good Fortune Points and the Scan tab.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Create a version of this for logged-in users where we don’t ask for email — it’ll be prepopulated.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.”"
          }
        ],
        "nx": 1,
        "ny": 1
      },
      {
        "id": "0:18763",
        "type": "decision",
        "label": "Artboard",
        "role": "Decision point.",
        "nx": 0.61,
        "ny": 0.015
      },
      {
        "id": "0:18902",
        "type": "screen",
        "label": "Confirm loc.",
        "thumb": "confirm",
        "role": "Share GPS or enter a ZIP to confirm the store.",
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.49,
        "ny": 0.343
      },
      {
        "id": "0:18839",
        "type": "screen",
        "label": "Confirm loc.",
        "thumb": "confirm",
        "role": "Share GPS or enter a ZIP to confirm the store.",
        "notes": [
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          }
        ],
        "nx": 0.49,
        "ny": 0.681
      },
      {
        "id": "0:18773",
        "type": "decision",
        "label": "Not Pilot",
        "role": "Branch — store not in the pilot.",
        "nx": 0.734,
        "ny": 0
      },
      {
        "id": "0:18783",
        "type": "decision",
        "label": "Pilot",
        "role": "Branch — store is in the pilot.",
        "nx": 0.734,
        "ny": 0.267
      },
      {
        "id": "0:18814",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.867,
        "ny": 0.231
      },
      {
        "id": "0:18775",
        "type": "decision",
        "label": "Logged In",
        "role": "Branch — signed in.",
        "nx": 0.867,
        "ny": 0.64
      },
      {
        "id": "0:19793",
        "type": "screen",
        "label": "Welcome",
        "thumb": "introSignin",
        "role": "The enrollment hook — \"Great news!… testing our new rewards program.\"",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 1,
        "ny": 0.225
      },
      {
        "id": "0:18989",
        "type": "screen",
        "label": "Welcome",
        "thumb": "intro",
        "role": "The enrollment hook — \"Great news!… testing our new rewards program.\"",
        "nx": 1,
        "ny": 0.64
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
        "from": "0:18694",
        "to": "0:18829"
      }
    ]
  },
  {
    "id": "flow3",
    "title": "Flow 3 · Desktop · full journey",
    "blurb": "Desktop scan → location/pilot gate → auth → loyalty branch → rewards (the fullest variant).",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:14989",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry — scanning a QR at the table.",
        "nx": 0,
        "ny": 0.413
      },
      {
        "id": "0:14986",
        "type": "decision",
        "label": "If Web",
        "role": "Branch — opened the web?",
        "nx": 0.079,
        "ny": 0.413
      },
      {
        "id": "47:13079",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          }
        ],
        "nx": 0.142,
        "ny": 0.401
      },
      {
        "id": "0:18692",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a member.",
        "nx": 0.291,
        "ny": 0.756
      },
      {
        "id": "0:14982",
        "type": "decision",
        "label": "Non Loyalty",
        "role": "Branch — not a loyalty member.",
        "nx": 0.291,
        "ny": 0.413
      },
      {
        "id": "0:15021",
        "type": "screen",
        "label": "Rewards page",
        "thumb": "educational",
        "role": "Education hub — How to Collect / Easy Ways to Redeem.",
        "nx": 1,
        "ny": 1
      },
      {
        "id": "0:14992",
        "type": "decision",
        "label": "Location known",
        "role": "Branch — is location known?",
        "nx": 0.379,
        "ny": 0.356
      },
      {
        "id": "0:14998",
        "type": "decision",
        "label": "Location blocked",
        "role": "Branch — permission denied; fall back to ZIP.",
        "nx": 0.379,
        "ny": 0.649
      },
      {
        "id": "0:14995",
        "type": "decision",
        "label": "Location unknown",
        "role": "Branch — location not yet known.",
        "nx": 0.379,
        "ny": 0.476
      },
      {
        "id": "0:77",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.638,
        "ny": 0.331
      },
      {
        "id": "0:2",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          }
        ],
        "nx": 0.472,
        "ny": 0.61
      },
      {
        "id": "0:126",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.472,
        "ny": 0.438
      },
      {
        "id": "0:15004",
        "type": "decision",
        "label": "Not Pilot",
        "role": "Branch — store not in the pilot.",
        "nx": 0.804,
        "ny": 0.28
      },
      {
        "id": "0:15000",
        "type": "decision",
        "label": "If Pilot",
        "role": "Branch — store in the pilot?",
        "nx": 0.804,
        "ny": 0.418
      },
      {
        "id": "0:15009",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.874,
        "ny": 0.28
      },
      {
        "id": "0:15013",
        "type": "decision",
        "label": "Logged-in non-member",
        "role": "Branch — signed in, not a member.",
        "nx": 0.874,
        "ny": 0.106
      },
      {
        "id": "0:15017",
        "type": "decision",
        "label": "If Guest",
        "role": "Branch — guest path.",
        "nx": 0.874,
        "ny": 0.418
      },
      {
        "id": "0:15019",
        "type": "decision",
        "label": "If Logged In",
        "role": "Branch — logged-in path.",
        "nx": 0.874,
        "ny": 0.682
      },
      {
        "id": "94:13280",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 1,
        "ny": 0.202
      },
      {
        "id": "10:11439",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Create a version of this for logged-in users where we don’t ask for email — it’ll be prepopulated.”"
          }
        ],
        "nx": 1,
        "ny": 0
      },
      {
        "id": "0:201",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "nx": 1,
        "ny": 0.391
      },
      {
        "id": "4:5994",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.”"
          }
        ],
        "nx": 1,
        "ny": 0.805
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
      }
    ]
  },
  {
    "id": "flow4",
    "title": "Flow 4 · Desktop · receipt scan",
    "blurb": "Desktop receipt-QR scan straight into the auth + loyalty branch.",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:18754",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry — the diner scans the QR on their receipt.",
        "nx": 0,
        "ny": 0.057
      },
      {
        "id": "0:18699",
        "type": "decision",
        "label": "If Web",
        "role": "Branch — opened the web?",
        "nx": 0.105,
        "ny": 0.054
      },
      {
        "id": "0:18701",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          }
        ],
        "nx": 0.181,
        "ny": 0.045
      },
      {
        "id": "0:18818",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.371,
        "ny": 0.069
      },
      {
        "id": "0:18780",
        "type": "decision",
        "label": "Logged In",
        "role": "Branch — signed in.",
        "nx": 0.371,
        "ny": 0.408
      },
      {
        "id": "0:19522",
        "type": "screen",
        "label": "Confirm loc.",
        "thumb": "confirm",
        "role": "Share GPS or enter a ZIP to confirm the store.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.698,
        "ny": 0
      },
      {
        "id": "0:18837",
        "type": "decision",
        "label": "Not Loyalty",
        "role": "Branch — not a member yet.",
        "nx": 0.447,
        "ny": 0.418
      },
      {
        "id": "0:18833",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a member.",
        "nx": 0.447,
        "ny": 0.576
      },
      {
        "id": "0:18822",
        "type": "decision",
        "label": "Sign in",
        "role": "Branch — routes to Azure sign-in.",
        "nx": 0.891,
        "ny": 0.069
      },
      {
        "id": "0:26985",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "notes": [
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.551,
        "ny": 0.397
      },
      {
        "id": "0:16855",
        "type": "screen",
        "label": "Rewards page",
        "thumb": "educational",
        "role": "Education hub — How to Collect / Easy Ways to Redeem.",
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          }
        ],
        "nx": 0.551,
        "ny": 1
      },
      {
        "id": "0:33219",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.861,
        "ny": 0.397
      },
      {
        "id": "0:39498",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Create a version of this for logged-in users where we don’t ask for email — it’ll be prepopulated.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.”"
          }
        ],
        "nx": 1,
        "ny": 0.397
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
      }
    ]
  },
  {
    "id": "flow5",
    "title": "Flow 5 · Desktop · loyalty join",
    "blurb": "The logged-in join sub-flow: confirmation → join gate → rewards or fallback.",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:26985",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "notes": [
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          }
        ],
        "nx": 0,
        "ny": 0
      },
      {
        "id": "0:33219",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ],
        "nx": 0.691,
        "ny": 0
      },
      {
        "id": "0:16855",
        "type": "screen",
        "label": "Rewards page",
        "thumb": "educational",
        "role": "Education hub — How to Collect / Easy Ways to Redeem.",
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          }
        ],
        "nx": 0,
        "ny": 1
      },
      {
        "id": "0:39498",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Create a version of this for logged-in users where we don’t ask for email — it’ll be prepopulated.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.”"
          }
        ],
        "nx": 1,
        "ny": 0
      }
    ],
    "edges": [
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
      }
    ]
  },
  {
    "id": "flow6",
    "title": "Flow 6 · Mobile web · location & pilot gating",
    "blurb": "Mobile-web tabletop entry: location, pilot check, then enroll or “coming soon.”",
    "platform": "mobile-web",
    "nodes": [
      {
        "id": "4:44462",
        "type": "decision",
        "label": "Location known",
        "role": "Branch — is location known?",
        "nx": 0,
        "ny": 0.477
      },
      {
        "id": "4:44485",
        "type": "decision",
        "label": "Logged-in non-member",
        "role": "Branch — signed in, not a member.",
        "nx": 0.762,
        "ny": 0.236
      },
      {
        "id": "4:29792",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          }
        ],
        "nx": 0.466,
        "ny": 0.405
      },
      {
        "id": "4:14178",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Create a version of this for logged-in users where we don’t ask for email — it’ll be prepopulated.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.”"
          }
        ],
        "nx": 1,
        "ny": 0
      },
      {
        "id": "4:44475",
        "type": "decision",
        "label": "Not Pilot",
        "role": "Branch — store not in the pilot.",
        "nx": 0.655,
        "ny": 0.382
      },
      {
        "id": "4:44470",
        "type": "decision",
        "label": "If Pilot",
        "role": "Branch — store in the pilot?",
        "nx": 0.655,
        "ny": 0.555
      },
      {
        "id": "4:44481",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.762,
        "ny": 0.382
      },
      {
        "id": "4:44489",
        "type": "decision",
        "label": "If Guest",
        "role": "Branch — guest path.",
        "nx": 0.762,
        "ny": 0.555
      },
      {
        "id": "4:44491",
        "type": "decision",
        "label": "If Logged In",
        "role": "Branch — logged-in path.",
        "nx": 0.762,
        "ny": 0.887
      },
      {
        "id": "4:14721",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "nx": 1,
        "ny": 0.294
      },
      {
        "id": "4:21959",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A \"Good Fortune Awaits\" splash while state resolves.",
        "nx": 1,
        "ny": 1
      }
    ],
    "edges": [
      {
        "from": "4:29792",
        "to": "4:44475"
      },
      {
        "from": "4:44462",
        "to": "4:29792"
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
        "from": "4:29792",
        "to": "4:44470"
      }
    ]
  },
  {
    "id": "flow7",
    "title": "Flow 7 · Mobile · receipt scan",
    "blurb": "Mobile receipt-QR scan into sign-in, confirmation and rewards.",
    "platform": "mobile",
    "nodes": [
      {
        "id": "4:49745",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0,
        "ny": 0.075
      },
      {
        "id": "4:49963",
        "type": "screen",
        "label": "Sign in",
        "thumb": "signin",
        "role": "Authenticate via Facebook, Google, Apple or email (Azure).",
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Create a version of this for logged-in users where we don’t ask for email — it’ll be prepopulated.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.”"
          }
        ],
        "nx": 0.665,
        "ny": 0
      },
      {
        "id": "4:49747",
        "type": "decision",
        "label": "Sign in",
        "role": "Branch — routes to Azure sign-in.",
        "nx": 1,
        "ny": 0.139
      },
      {
        "id": "4:50725",
        "type": "screen",
        "label": "Rewards",
        "thumb": "rewards",
        "role": "The payoff — Good Fortune Points and the Scan tab.",
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          }
        ],
        "nx": 0.659,
        "ny": 1
      }
    ],
    "edges": [
      {
        "from": "4:49745",
        "to": "4:49963"
      },
      {
        "from": "4:49747",
        "to": "4:50725"
      },
      {
        "from": "4:49963",
        "to": "4:49747"
      }
    ]
  }
]
