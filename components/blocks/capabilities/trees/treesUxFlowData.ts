//
// Trees UX architecture - top-down flow data.
//
// Traced from the "Trees Wireframes" Figma sitemap (file ChRGTElERDmhPMpLKQZnN6,
// page "Sitemap"): a self-improvement app whose Bottom Navigation fans out to
// Community, Homepage and Profile. The core loop is Create Goal -> a Machine-
// Learning matching algorithm -> ranked Action Plans -> track + rate.
//
// Same node/edge shape as the Wingstop/Panda flow renderers so the top-down
// TreesUxFlow renderer can auto-lay-out a layered DAG with curved connectors,
// a legend, flow jump-pills and hover cards. type "entry" = a start; "screen" =
// a real captured wireframe (has a thumb); "event" = a branch/state; "api" = the
// ML matching repository (drawn as a server/algorithm node).
//
export type TreesFlowNodeType = 'entry' | 'screen' | 'event' | 'api'
export interface TreesFlowNode {
  id: string
  type: TreesFlowNodeType
  label: string
  role?: string
  /** Absolute path to an existing wireframe webp under /public/capabilities/trees. */
  thumb?: string
}
export interface TreesFlowEdge {
  from: string
  to: string
  /** dashed, de-emphasised link (return / feeds-algorithm). */
  back?: boolean
}
export interface TreesFlow {
  id: string
  title: string
  platform: 'mobile' | 'desktop'
  nodes: TreesFlowNode[]
  edges: TreesFlowEdge[]
}

export const TREES_FLOWS: TreesFlow[] = [
  /* -- Flow 1 - Mobile - goal -> matched action plan --
     The spine of the product. From the dashboard you create a goal, answer a
     short questionnaire, and a machine-learning algorithm matches you to a
     ranked list of action plans -- which you open, add, and start tracking. */
  {
    id: 'goal-to-plan',
    title: 'Mobile · goal → matched action plan',
    platform: 'mobile',
    nodes: [
      { id: 'home', type: 'entry', label: 'Homepage', role: 'Entry — the dashboard. New users land on an empty state prompting a first goal.', thumb: '/capabilities/trees/wire-2.webp' },
      { id: 'search', type: 'screen', label: 'Goal search', role: 'Search or browse the goal library to start a new goal.', thumb: '/capabilities/trees/wire-3.webp' },
      { id: 'intro', type: 'screen', label: 'Goal intro', role: 'A primer on the goal before committing — what it takes and who it suits.', thumb: '/capabilities/trees/wire-3.webp' },
      { id: 'questionnaire', type: 'screen', label: 'Questionnaire', role: 'A short set of questions that profile your context for the matching algorithm.', thumb: '/capabilities/trees/wire-4.webp' },
      { id: 'algo', type: 'api', label: 'Matching algorithm', role: 'The ML repository ranks every action plan against your questionnaire answers and returns the best-fit set.' },
      { id: 'plans', type: 'screen', label: 'Action plan list', role: 'Matched plans returned as ranked cards — "91% of people like you complete this".', thumb: '/capabilities/trees/wire-5.webp' },
      { id: 'detail', type: 'screen', label: 'Action plan detail', role: 'A real task checklist with a clear add-to-plan CTA.', thumb: '/capabilities/trees/wire-6.webp' },
      { id: 'goal', type: 'screen', label: 'Goal page', role: 'The created goal — your active plan, progress, and community in one place.', thumb: '/capabilities/trees/wire-6.webp' },
    ],
    edges: [
      { from: 'home', to: 'search' },
      { from: 'search', to: 'intro' },
      { from: 'intro', to: 'questionnaire' },
      { from: 'questionnaire', to: 'algo' },
      { from: 'algo', to: 'plans' },
      { from: 'plans', to: 'detail' },
      { from: 'detail', to: 'goal' },
      { from: 'detail', to: 'plans', back: true },
    ],
  },

  /* -- Flow 2 - Mobile - create an action plan --
     The authoring path -- a linear builder where a user composes a sharable
     action plan others can be matched to. */
  {
    id: 'create-plan',
    title: 'Mobile · create an action plan',
    platform: 'mobile',
    nodes: [
      { id: 'start', type: 'entry', label: 'Create action plan', role: 'Entry — start authoring a plan others can adopt.' },
      { id: 'title', type: 'screen', label: 'Add title', role: 'Name the plan.' },
      { id: 'desc', type: 'screen', label: 'Add description', role: 'Describe the plan and what it achieves.' },
      { id: 'secrecy', type: 'event', label: 'Profile secrecy', role: 'Choose whether the plan is public, community-only, or private.' },
      { id: 'tags', type: 'screen', label: 'Add tags', role: 'Tag the plan so the matching algorithm can place it.' },
      { id: 'tasks', type: 'screen', label: 'Task list', role: 'Build the ordered list of tasks that make up the plan.' },
      { id: 'taskcreate', type: 'screen', label: 'Task creation', role: 'Author each task — the unit a follower checks off.' },
    ],
    edges: [
      { from: 'start', to: 'title' },
      { from: 'title', to: 'desc' },
      { from: 'desc', to: 'secrecy' },
      { from: 'secrecy', to: 'tags' },
      { from: 'tags', to: 'tasks' },
      { from: 'tasks', to: 'taskcreate' },
    ],
  },

  /* -- Flow 3 - Mobile - full app map --
     The whole information architecture: Bottom Navigation fans to Community,
     Homepage and Profile, with the goal-creation loop hanging off Homepage. */
  {
    id: 'app-map',
    title: 'Mobile · full app map',
    platform: 'mobile',
    nodes: [
      { id: 'nav', type: 'entry', label: 'Bottom navigation', role: 'The app shell — three primary tabs.' },
      { id: 'community', type: 'screen', label: 'Community', role: 'Social hub — forum and shared plans.' },
      { id: 'forum', type: 'screen', label: 'Forum', role: 'Discussion threads across the community.' },
      { id: 'home', type: 'screen', label: 'Homepage', role: 'The dashboard and the entry to goal creation.', thumb: '/capabilities/trees/wire-2.webp' },
      { id: 'creategoal', type: 'screen', label: 'Create goal', role: 'The goal-creation loop — search, questionnaire, matched plans.', thumb: '/capabilities/trees/wire-3.webp' },
      { id: 'goalpage', type: 'screen', label: 'Goal page', role: 'An active goal: action plans, goal community, and progress.', thumb: '/capabilities/trees/wire-6.webp' },
      { id: 'profile', type: 'screen', label: 'Profile', role: 'Your account home.' },
      { id: 'created', type: 'screen', label: 'Created plans', role: 'Plans you have authored.' },
      { id: 'settings', type: 'event', label: 'Messages + settings', role: 'Inbox and account settings.' },
    ],
    edges: [
      { from: 'nav', to: 'community' },
      { from: 'nav', to: 'home' },
      { from: 'nav', to: 'profile' },
      { from: 'community', to: 'forum' },
      { from: 'home', to: 'creategoal' },
      { from: 'home', to: 'goalpage' },
      { from: 'profile', to: 'created' },
      { from: 'profile', to: 'settings' },
    ],
  },
]
