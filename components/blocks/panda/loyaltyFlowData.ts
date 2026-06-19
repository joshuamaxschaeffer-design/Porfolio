// AUTO-GENERATED from the Loyalty-QR-Enrollment Figma file (verified prototype graph).
// 5 prototype flows, every wired node. Do not hand-edit positions; regenerate from the model script.
export type FlowNodeType = "entry" | "screen" | "decision" | "api" | "note"
export interface FlowNote { kind: "api" | "note"; label: string; detail: string }
export interface FlowNode {
  id: string
  type: FlowNodeType
  label: string
  role?: string
  thumb?: string
  detail?: string
  notes?: FlowNote[]
  nx: number
  ny: number
}
export interface FlowEdge { from: string; to: string; label?: string }
export interface Flow {
  id: string
  title: string
  blurb: string
  platform: "mobile" | "mobile-web" | "desktop" | "mixed"
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export const FLOWS: Flow[] = [
  {
    "id": "flow1",
    "title": "Mobile · receipt scan",
    "blurb": "Mobile receipt-QR scan into sign-in, confirmation and rewards.",
    "platform": "mixed",
    "nodes": [
      {
        "id": "4:29792",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.592,
        "ny": 0.826
      },
      {
        "id": "4:44475",
        "type": "decision",
        "label": "Not Pilot",
        "role": "Branch — store not in the pilot.",
        "nx": 0.737,
        "ny": 0.821
      },
      {
        "id": "4:83983",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.384,
        "ny": 0.857,
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          }
        ]
      },
      {
        "id": "0:18694",
        "type": "decision",
        "label": "If App",
        "role": "Branch — did they open the native app?",
        "nx": 0.109,
        "ny": 0.047
      },
      {
        "id": "0:18757",
        "type": "decision",
        "label": "Non Loyalty",
        "role": "Branch — account isn’t a loyalty member.",
        "nx": 0.172,
        "ny": 0.047
      },
      {
        "id": "0:18839",
        "type": "screen",
        "label": "Confirm loc.",
        "thumb": "confirm",
        "role": "Share GPS or enter a ZIP to confirm the store.",
        "nx": 0.363,
        "ny": 0.102,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "0:18902",
        "type": "screen",
        "label": "Confirm loc.",
        "thumb": "confirm",
        "role": "Share GPS or enter a ZIP to confirm the store.",
        "nx": 0.363,
        "ny": 0.064,
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
        ]
      },
      {
        "id": "4:30146",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.384,
        "ny": 0.905
      },
      {
        "id": "4:44449",
        "type": "decision",
        "label": "Non Loyalty",
        "role": "Branch — account isn’t a loyalty member.",
        "nx": 0.134,
        "ny": 0.854
      },
      {
        "id": "4:44462",
        "type": "decision",
        "label": "Location known",
        "role": "Branch — do we already have their location?",
        "nx": 0.237,
        "ny": 0.84
      },
      {
        "id": "4:44468",
        "type": "decision",
        "label": "Location blocked",
        "role": "Branch — location permission denied; fall back to ZIP.",
        "nx": 0.237,
        "ny": 0.911
      },
      {
        "id": "4:44465",
        "type": "decision",
        "label": "Location unknown",
        "role": "Branch — location not yet known.",
        "nx": 0.237,
        "ny": 0.869
      },
      {
        "id": "4:44455",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry — scanning a QR at the table (tabletop enrollment).",
        "nx": 0.071,
        "ny": 0.854
      },
      {
        "id": "4:46329",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a loyalty member.",
        "nx": 0.134,
        "ny": 0.937
      },
      {
        "id": "4:44459",
        "type": "decision",
        "label": "If App/Web",
        "role": "Branch — app vs web channel.",
        "nx": 0,
        "ny": 0.854
      },
      {
        "id": "4:44470",
        "type": "decision",
        "label": "If Pilot",
        "role": "Branch — is this store in the pilot?",
        "nx": 0.737,
        "ny": 0.855
      },
      {
        "id": "4:44489",
        "type": "decision",
        "label": "If Guest",
        "role": "Branch — guest path.",
        "nx": 0.819,
        "ny": 0.855
      },
      {
        "id": "4:44491",
        "type": "decision",
        "label": "If Logged In",
        "role": "Branch — logged-in path.",
        "nx": 0.819,
        "ny": 0.919
      },
      {
        "id": "4:44481",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.819,
        "ny": 0.821
      },
      {
        "id": "4:44485",
        "type": "decision",
        "label": "Logged-in non-member",
        "role": "Branch — signed in but not a member.",
        "nx": 0.819,
        "ny": 0.793
      },
      {
        "id": "4:14721",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0.804
      },
      {
        "id": "4:14178",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0.747
      },
      {
        "id": "4:21959",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0.941
      },
      {
        "id": "4:48128",
        "type": "screen",
        "label": "Rewards",
        "thumb": "rewards",
        "role": "The payoff — Good Fortune Points and the Scan tab.",
        "nx": 1,
        "ny": 1
      },
      {
        "id": "0:18748",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry — scanning a QR at the table (tabletop enrollment).",
        "nx": 0.038,
        "ny": 0.047
      },
      {
        "id": "0:18761",
        "type": "decision",
        "label": "Location known",
        "role": "Branch — do we already have their location?",
        "nx": 0.275,
        "ny": 0.035
      },
      {
        "id": "0:18824",
        "type": "decision",
        "label": "Location unknown",
        "role": "Branch — location not yet known.",
        "nx": 0.275,
        "ny": 0.064
      },
      {
        "id": "0:18827",
        "type": "decision",
        "label": "Location blocked",
        "role": "Branch — location permission denied; fall back to ZIP.",
        "nx": 0.275,
        "ny": 0.099
      },
      {
        "id": "0:18763",
        "type": "decision",
        "label": "(loading)",
        "role": "Decision point.",
        "nx": 0.442,
        "ny": 0.028
      },
      {
        "id": "0:18773",
        "type": "decision",
        "label": "Not Pilot",
        "role": "Branch — store not in the pilot.",
        "nx": 0.524,
        "ny": 0.026
      },
      {
        "id": "0:18783",
        "type": "decision",
        "label": "Pilot",
        "role": "Branch — store is in the pilot.",
        "nx": 0.524,
        "ny": 0.056
      },
      {
        "id": "0:18775",
        "type": "decision",
        "label": "Logged In",
        "role": "Branch — signed in to a Panda account.",
        "nx": 0.612,
        "ny": 0.098
      },
      {
        "id": "0:18989",
        "type": "screen",
        "label": "Welcome",
        "thumb": "intro",
        "role": "The enrollment hook — “Great news!… testing our new rewards program.”",
        "nx": 0.7,
        "ny": 0.098
      },
      {
        "id": "0:18814",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.612,
        "ny": 0.052
      },
      {
        "id": "0:19793",
        "type": "screen",
        "label": "Welcome",
        "thumb": "introSignin",
        "role": "The enrollment hook — “Great news!… testing our new rewards program.”",
        "nx": 0.7,
        "ny": 0.051
      },
      {
        "id": "37:16823",
        "type": "decision",
        "label": "Correct ZIP",
        "role": "Branch — a valid pilot ZIP was entered.",
        "nx": 0.661,
        "ny": 0.035
      },
      {
        "id": "0:18829",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a loyalty member.",
        "nx": 0.172,
        "ny": 0.121
      },
      {
        "id": "0:20653",
        "type": "screen",
        "label": "Rewards",
        "thumb": "rewards",
        "role": "The payoff — Good Fortune Points and the Scan tab.",
        "nx": 0.7,
        "ny": 0.138
      },
      {
        "id": "39:13395",
        "type": "screen",
        "label": "Welcome",
        "thumb": "introSignin",
        "role": "The enrollment hook — “Great news!… testing our new rewards program.”",
        "nx": 0.795,
        "ny": 0,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
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
        "from": "0:18694",
        "to": "0:18757"
      },
      {
        "from": "0:18839",
        "to": "0:18902"
      },
      {
        "from": "4:30146",
        "to": "0:18902"
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
        "from": "4:29792",
        "to": "4:44470"
      },
      {
        "from": "0:18694",
        "to": "0:18829"
      }
    ]
  },
  {
    "id": "flow2",
    "title": "Desktop · receipt scan",
    "blurb": "Desktop receipt-QR scan straight into the auth + loyalty branch.",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:77",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.638,
        "ny": 0.331,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
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
        "id": "0:14982",
        "type": "decision",
        "label": "Non Loyalty",
        "role": "Branch — account isn’t a loyalty member.",
        "nx": 0.291,
        "ny": 0.413
      },
      {
        "id": "0:14992",
        "type": "decision",
        "label": "Location known",
        "role": "Branch — do we already have their location?",
        "nx": 0.379,
        "ny": 0.356
      },
      {
        "id": "0:2",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.472,
        "ny": 0.61
      },
      {
        "id": "47:13079",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.142,
        "ny": 0.401,
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
        ]
      },
      {
        "id": "0:18692",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a loyalty member.",
        "nx": 0.291,
        "ny": 0.756
      },
      {
        "id": "0:126",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.472,
        "ny": 0.438,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "0:14998",
        "type": "decision",
        "label": "Location blocked",
        "role": "Branch — location permission denied; fall back to ZIP.",
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
        "id": "0:14986",
        "type": "decision",
        "label": "If Web",
        "role": "Branch — did they open the web?",
        "nx": 0.079,
        "ny": 0.413
      },
      {
        "id": "0:14989",
        "type": "entry",
        "label": "Tabletop QR",
        "role": "Entry — scanning a QR at the table (tabletop enrollment).",
        "nx": 0,
        "ny": 0.413
      },
      {
        "id": "0:15000",
        "type": "decision",
        "label": "If Pilot",
        "role": "Branch — is this store in the pilot?",
        "nx": 0.804,
        "ny": 0.418
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
        "role": "Branch — signed in but not a member.",
        "nx": 0.874,
        "ny": 0.106
      },
      {
        "id": "94:13280",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0.202,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "10:11439",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0,
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
        ]
      },
      {
        "id": "0:201",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0.391
      },
      {
        "id": "4:5994",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 1,
        "ny": 0.805,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "“While on this page, disable the location popup, even though they are at a pilot location.”"
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "Design note: “Should be ‘My Rewards’.” (copy fix flagged in the file.)"
          }
        ]
      },
      {
        "id": "0:15021",
        "type": "screen",
        "label": "Rewards page",
        "thumb": "educational",
        "role": "Education hub — How to Collect / Easy Ways to Redeem.",
        "nx": 1,
        "ny": 1
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
    "id": "flow3",
    "title": "Desktop · loyalty branch",
    "blurb": "Desktop receipt-QR scan straight into the auth + loyalty branch.",
    "platform": "desktop",
    "nodes": [
      {
        "id": "0:18701",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.417,
        "ny": 0.045,
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
          },
          {
            "kind": "api",
            "label": "Punchh",
            "detail": "Punchh associates the scanned transaction to the logged-in user so the points are credited."
          },
          {
            "kind": "note",
            "label": "Note",
            "detail": "“Great news! The Panda Express near you is testing our new rewards program. Start collecting Good Fortune and receive your free welcome gift, now!”"
          }
        ]
      },
      {
        "id": "0:18818",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.552,
        "ny": 0.069
      },
      {
        "id": "0:18780",
        "type": "decision",
        "label": "Logged In",
        "role": "Branch — signed in to a Panda account.",
        "nx": 0.552,
        "ny": 0.408
      },
      {
        "id": "0:18837",
        "type": "decision",
        "label": "Not Loyalty",
        "role": "Branch — not a member yet.",
        "nx": 0.607,
        "ny": 0.418
      },
      {
        "id": "0:18699",
        "type": "decision",
        "label": "If Web",
        "role": "Branch — did they open the web?",
        "nx": 0.363,
        "ny": 0.054
      },
      {
        "id": "0:18754",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry — the diner scans the QR on their receipt.",
        "nx": 0.288,
        "ny": 0.057
      },
      {
        "id": "0:19522",
        "type": "screen",
        "label": "Confirm loc.",
        "thumb": "confirm",
        "role": "Share GPS or enter a ZIP to confirm the store.",
        "nx": 0.785,
        "ny": 0,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "0:18822",
        "type": "decision",
        "label": "Sign in",
        "role": "Branch — routes to the Azure sign-in.",
        "nx": 0.923,
        "ny": 0.069
      },
      {
        "id": "0:16855",
        "type": "screen",
        "label": "Rewards page",
        "thumb": "educational",
        "role": "Education hub — How to Collect / Easy Ways to Redeem.",
        "nx": 0.68,
        "ny": 1
      },
      {
        "id": "0:18833",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a loyalty member.",
        "nx": 0.607,
        "ny": 0.576
      },
      {
        "id": "0:26985",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "nx": 0.68,
        "ny": 0.397,
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
        ]
      },
      {
        "id": "0:33219",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "nx": 0.901,
        "ny": 0.397,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "0:39498",
        "type": "screen",
        "label": "How it works",
        "thumb": "howitworks",
        "role": "Benefits — 10 points / $1, monthly gift, birthday gift, offers.",
        "nx": 1,
        "ny": 0.397
      },
      {
        "id": "70:13988",
        "type": "decision",
        "label": "Rectangle",
        "role": "Decision point.",
        "nx": 0,
        "ny": 0.686
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
        "from": "70:13988",
        "to": "0:33219"
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
    "id": "flow4",
    "title": "Out-of-range / not pilot",
    "blurb": "When the store isn’t in the pilot — email capture and the out-of-range path.",
    "platform": "mixed",
    "nodes": [
      {
        "id": "4:52475",
        "type": "screen",
        "label": "Loading",
        "thumb": "loading",
        "role": "A “Good Fortune Awaits” splash while state resolves.",
        "nx": 0.269,
        "ny": 0.055,
        "notes": [
          {
            "kind": "api",
            "label": "Firebase",
            "detail": "Firebase redirects route the scanned QR to the right enrollment entry."
          }
        ]
      },
      {
        "id": "4:49730",
        "type": "decision",
        "label": "Logged In",
        "role": "Branch — signed in to a Panda account.",
        "nx": 0.383,
        "ny": 0.567
      },
      {
        "id": "4:49745",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.383,
        "ny": 0.075
      },
      {
        "id": "4:49717",
        "type": "decision",
        "label": "If App/Web",
        "role": "Branch — app vs web channel.",
        "nx": 0.183,
        "ny": 0.092
      },
      {
        "id": "4:49720",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry — the diner scans the QR on their receipt.",
        "nx": 0,
        "ny": 0.098
      },
      {
        "id": "4:49751",
        "type": "decision",
        "label": "Not Loyalty",
        "role": "Branch — not a member yet.",
        "nx": 0.517,
        "ny": 0.586
      },
      {
        "id": "4:49749",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a loyalty member.",
        "nx": 0.517,
        "ny": 0.887
      },
      {
        "id": "4:49963",
        "type": "screen",
        "label": "Sign in",
        "thumb": "signin",
        "role": "Authenticate via Facebook, Google, Apple or email (Azure).",
        "nx": 0.786,
        "ny": 0
      },
      {
        "id": "4:49747",
        "type": "decision",
        "label": "Sign in",
        "role": "Branch — routes to the Azure sign-in.",
        "nx": 0.989,
        "ny": 0.139
      },
      {
        "id": "4:50725",
        "type": "screen",
        "label": "Rewards",
        "thumb": "rewards",
        "role": "The payoff — Good Fortune Points and the Scan tab.",
        "nx": 0.782,
        "ny": 1
      },
      {
        "id": "4:58910",
        "type": "screen",
        "label": "Out of range",
        "thumb": "joingate",
        "role": "Join gate / fallback when out of range.",
        "nx": 0.782,
        "ny": 0.561
      },
      {
        "id": "4:71365",
        "type": "screen",
        "label": "Out of range",
        "thumb": "joingate",
        "role": "Join gate / fallback when out of range.",
        "nx": 0.916,
        "ny": 0.561
      },
      {
        "id": "4:77761",
        "type": "screen",
        "label": "Out of range",
        "thumb": "joingate",
        "role": "Join gate / fallback when out of range.",
        "nx": 1,
        "ny": 0.561
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
      }
    ]
  },
  {
    "id": "flow5",
    "title": "Mobile · rewards path",
    "blurb": "Mobile receipt-QR scan into sign-in, confirmation and rewards.",
    "platform": "mobile",
    "nodes": [
      {
        "id": "0:18697",
        "type": "decision",
        "label": "If App",
        "role": "Branch — did they open the native app?",
        "nx": 0.169,
        "ny": 0.122
      },
      {
        "id": "0:18768",
        "type": "decision",
        "label": "(loading)",
        "role": "Decision point.",
        "nx": 0.248,
        "ny": 0.122
      },
      {
        "id": "0:18751",
        "type": "entry",
        "label": "Receipt QR",
        "role": "Entry — the diner scans the QR on their receipt.",
        "nx": 0,
        "ny": 0.127
      },
      {
        "id": "0:18777",
        "type": "decision",
        "label": "Logged In",
        "role": "Branch — signed in to a Panda account.",
        "nx": 0.353,
        "ny": 0.581
      },
      {
        "id": "0:18835",
        "type": "decision",
        "label": "Not Loyalty",
        "role": "Branch — not a member yet.",
        "nx": 0.476,
        "ny": 0.6
      },
      {
        "id": "0:18831",
        "type": "decision",
        "label": "If Loyalty",
        "role": "Branch — already a loyalty member.",
        "nx": 0.476,
        "ny": 0.891
      },
      {
        "id": "0:18816",
        "type": "decision",
        "label": "Guest",
        "role": "Branch — not signed in.",
        "nx": 0.353,
        "ny": 0.122
      },
      {
        "id": "0:19424",
        "type": "screen",
        "label": "Sign in",
        "thumb": "signin",
        "role": "Authenticate via Facebook, Google, Apple or email (Azure).",
        "nx": 0.794,
        "ny": 0,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "0:18820",
        "type": "decision",
        "label": "Sign in",
        "role": "Branch — routes to the Azure sign-in.",
        "nx": 0.911,
        "ny": 0.167
      },
      {
        "id": "0:20707",
        "type": "screen",
        "label": "Rewards",
        "thumb": "rewards",
        "role": "The payoff — Good Fortune Points and the Scan tab.",
        "nx": 0.721,
        "ny": 1
      },
      {
        "id": "0:19206",
        "type": "screen",
        "label": "Welcome",
        "thumb": "intro",
        "role": "The enrollment hook — “Great news!… testing our new rewards program.”",
        "nx": 0.721,
        "ny": 0.581,
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
          }
        ]
      },
      {
        "id": "0:20223",
        "type": "screen",
        "label": "Welcome",
        "thumb": "introSignin",
        "role": "The enrollment hook — “Great news!… testing our new rewards program.”",
        "nx": 0.927,
        "ny": 0.581,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
      },
      {
        "id": "0:20485",
        "type": "screen",
        "label": "Welcome",
        "thumb": "introSignin",
        "role": "The enrollment hook — “Great news!… testing our new rewards program.”",
        "nx": 1,
        "ny": 0.581,
        "notes": [
          {
            "kind": "note",
            "label": "Note",
            "detail": "• Location enabled ,"
          }
        ]
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
      }
    ]
  }
]
