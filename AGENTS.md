# AGENTS.md — Hive Chat

Instructions for any AI agent or developer building UI in this repo.
Read this before creating or changing a screen or component.

---

## ★ Design reference & primary colour — read first

**Every screen and component must be built from the design file:**
`Claude outputs/hive-chat-ui.html` (open it in a browser).

- **Screens & Flows** tab → the layout, content and order of all 36 screens in 8 flows. Build each screen to match its mockup.
- **Clickable Prototype** tab → how screens connect (what each tap opens). Use it for navigation.
- **Components** tab → every reusable component with its name and props. Code must use the **same names and props**.
- It is a **visual reference, not code to copy.** Don't paste its HTML/CSS. Rebuild each piece as a typed React Native component, taking colours from the tokens (§3) and sizes through `responsive.ts` (§4a).
- If a screen you need is not in the design file, compose it from existing components in the same style and say so in your summary — don't invent a new look.

**The app's primary colour is Ocean blue — `#3D8BFF`.** It was chosen by the product owner and is final.

| Token | Value | Used for |
|---|---|---|
| `accent` | `#3D8BFF` | buttons, sent bubbles, active tab, badges, links, toggles, FAB |
| `accent2` | `#86B6FF` | lighter tint (highlights, focus glow) |
| `accentDeep` | `#1F68E0` | pressed state, gradient end |
| `onAccent` | `#FFFFFF` | text & icons on top of the accent |
| `tick` | `#D6F3FF` | read ticks inside a sent bubble |

- Always use these through the tokens (`colors.accent`, …) — never type the hex in a component.
- The design file has a "Primary" colour switcher (Violet, Coral, Honey) that was only for choosing. **Ignore those other colours** — build with Ocean only.
- Don't add new brand colours. Status colours (`mint`, `rose`, `sky`) are only for online/success, danger/missed and read ticks.

---

## 0. Build order: mobile first

**Build the mobile app (`mobile/`) first.** The web app (`web/`) comes later and will mirror the mobile components.
Until then, new components are built in `mobile/` only and marked `mobile` in the registry (§6).

---

## 0a. TypeScript only — no `any`

**Every source file is TypeScript**: `.ts` for logic, `.tsx` for anything with JSX. Never add a `.js` / `.jsx` source file.
The only exceptions are tool config files that tools require as JS (`eslint.config.js`, `babel.config.js`, `metro.config.js`).

- **Never use `any`** — not as a type, not in `as any`, not in generics (`Array<any>`), not implicitly. The lint rule `@typescript-eslint/no-explicit-any` fails the build.
  - Don't know the shape yet? Use `unknown` and narrow it with a type guard.
  - Works with many types? Use a generic (`<T>`).
  - Data from the server/socket? Define an interface for it in `src/types/`.
- **No `@ts-ignore` / `@ts-nocheck`** — fix the type instead (`@typescript-eslint/ban-ts-comment`).
- **Every component has a named props type**, exported next to it:
  ```tsx
  export interface ButtonProps {
    label: string;
    variant?: 'primary' | 'ghost' | 'text' | 'danger';
    disabled?: boolean;
    onPress: () => void;
  }
  export default function Button({ label, variant = 'primary', disabled = false, onPress }: ButtonProps) { … }
  ```
- **Use union types for variants** (`'in' | 'out'`), not plain `string`.
- **Type every function's parameters and return type** when it is exported; type `useState` when the initial value doesn't show the full type (`useState<ChatMessage[]>([])`).
- **Shared data shapes live in `src/types/`** (e.g. `src/types/chat.ts` has `ChatMessage` and the socket event maps). Import them with `import type { … }`.
- **Sockets are typed**: `Socket<ServerToClientEvents, ClientToServerEvents>` — add every new event to those interfaces.
- The compiler runs in **strict mode** (`mobile/tsconfig.json`: `strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, `noUnusedLocals`, …). Don't loosen these settings.

**Before finishing any change, run in `mobile/`:**

```bash
npm run check     # = npm run typecheck (tsc --noEmit) && npm run lint (expo lint)
```

Both must pass with zero errors.

---

## 1. The golden rule: reuse before you build

**Before writing any UI, check whether a component for it already exists.**
Never copy-paste a component or re-implement one inline in a screen.

Follow this every time:

1. **Look it up.** Search the [Component Registry](#6-component-registry) below, then the app's `src/components/index.ts`.
2. **It exists → use it.** Import it from `components/`, not from a deep path.
3. **It exists but needs a small difference → extend it.** Add a prop or a `variant` to the existing component. Do not create `Button2`, `BlueButton`, `ChatItemNew`, etc.
4. **It doesn't exist → try composing.** Can it be built from existing components? (e.g. a "Contact picker" = `SearchBar` + `ContactRow` + `Fab`.) If so, compose in the screen.
5. **It's truly new → create it properly** (see [§5](#5-creating-a-new-component)), export it from `index.ts`, and **add a row to the registry in the same change.**

If you are unsure whether something counts as "the same component", prefer extending the existing one.

---

## 2. Repo map

```
hive-chat/
├── server/            Node + Express + Socket.io + MongoDB
├── web/               React (Vite) web app
│   └── src/
│       ├── components/    ← reusable UI (see §4)
│       ├── screens/       ← one file per screen, composed from components
│       ├── hooks/         ← data/socket logic (useMessages, useTyping…)
│       └── theme/         ← tokens (see §3)
├── mobile/            React Native (Expo) app — BUILD THIS FIRST
│   └── src/
│       ├── components/  screens/  hooks/  theme/
│       ├── types/
│       │   └── chat.ts        ← shared data & socket event types
│       └── utils/
│           └── responsive.ts  ← screen-size helpers (see §4a)
└── Claude outputs/hive-chat-ui.html   ← DESIGN SOURCE OF TRUTH
```

**Design reference:** open `Claude outputs/hive-chat-ui.html` in a browser.
- *Screens & Flows* tab → every screen (36) and flow (8).
- *Components* tab → every component with its props. **Component names and props in code must match this file.**

---

## 3. Design tokens — never hardcode styles

All colours, radii, spacing and font sizes come from the theme tokens.
**Never write a raw hex colour, px radius or font size inside a component.**

Tokens live in one plain JS object per app (`web/src/theme/tokens.ts`, `mobile/src/theme/tokens.ts`) with identical content. When shared packages are set up, both apps will import one `shared/theme/tokens.ts` instead — until then, **change both files together.**

```ts
export const colors = {
  // brand (Ocean) — change only these to re-theme the app
  accent: '#3D8BFF',
  accent2: '#86B6FF',     // lighter tint
  accentDeep: '#1F68E0',  // pressed / gradient end
  onAccent: '#FFFFFF',    // text & icons on accent
  tick: '#D6F3FF',        // read ticks inside outgoing bubble

  // neutrals (dark theme)
  bg: '#0C0D12',
  surface: '#14151C',
  surface2: '#1C1D26',
  surface3: '#262733',
  line: '#2A2B37',
  text: '#F2F2F7',
  muted: '#9A9CAE',
  faint: '#666879',
  dark: '#12121A',        // text on pastel fills (avatars)

  // status
  mint: '#4FD1A5',        // online / success
  rose: '#FF6B6B',        // danger / missed call
  sky: '#6CB8FF',         // read ticks on incoming
};

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };
export const space  = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
export const font   = {
  family: 'Plus Jakarta Sans',
  size: { xs: 11, sm: 13, md: 14.5, lg: 16, xl: 20, title: 24, hero: 30 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800' },
} as const;

export type ColorToken = keyof typeof colors;
```

---

## 4. Component structure

Components are grouped into four layers. Put a new component in the lowest layer that fits.

| Layer | Folder | What goes here | Examples |
|---|---|---|---|
| **ui** | `components/ui/` | Primitives. No app knowledge. | `Button`, `Icon`, `Avatar`, `TextField`, `Toggle`, `Badge`, `Chip` |
| **layout** | `components/layout/` | Page skeleton pieces. | `AppBar`, `TabBar`, `Sheet`, `Screen` |
| **chat** | `components/chat/` | Chat-specific building blocks. | `Bubble`, `Composer`, `ChatItem`, `ChatHeader`, `DateChip` |
| **feedback** | `components/feedback/` | States & messages. | `Banner`, `EmptyState`, `Typing` |

One folder per component:

```
components/ui/Button/
├── Button.tsx            component + exported `ButtonProps` type (styles via makeStyles on mobile, Button.module.css on web)
└── index.ts              → export { default } from './Button'; export type { ButtonProps } from './Button';
```

And every component is re-exported from `components/index.ts`, so screens always import like this:

```ts
import { Button, Avatar, ChatItem } from '../components';
import type { ButtonProps } from '../components';
```

**Web and mobile must use the same component names and the same props.** A screen in either app should read almost the same.

> **Decision: we keep two separate apps** — `web/` (React + Vite) and `mobile/` (React Native + Expo). They cannot share component code, so each component is built once per app, **mirrored**: same name, same folder path, same props. When you build or change a component in one app, either do the same in the other app in the same change, or mark it in the registry as built on one platform only (`web` / `mobile`).

---

## 4a. Responsiveness — the UI must never break on any screen size

All sizing in the mobile app goes through `mobile/src/utils/responsive.ts`.
It scales values from the design phone (360 × 760) to the real screen, with limits so things are never tiny on small phones or huge on tablets.

| Helper | Use for | Example |
|---|---|---|
| `ms(n)` | padding, margin, gap, radius (**most common**) | `padding: ms(16)` |
| `s(n)` | widths & sizes of avatars, icons, buttons | `width: s(52)` |
| `vs(n)` | vertical spacing on full-height screens (onboarding, calls) | `marginTop: vs(40)` |
| `fs(n)` | every `fontSize` | `fontSize: fs(15)` |
| `wp(%)` / `hp(%)` | percentage of screen width / height | `maxWidth: wp(78)` |
| `select({...})` | different values per breakpoint | `select({ phone: 4, tablet: 6 })` |
| `isTablet`, `isLandscape`, `breakpoint`, `contentWidth` | layout decisions | centre a column on tablets |

**How to write styles** — use `makeStyles`, which recalculates on rotation, split-screen and resize:

```tsx
import { makeStyles, useResponsive } from '../../utils/responsive';

const useStyles = makeStyles(({ s, ms, fs }) => ({
  row:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(16), gap: ms(12) },
  avatar: { width: s(52), height: s(52) },
  name:   { fontSize: fs(15), fontWeight: '700' },
}));

export interface ChatItemProps { person: Person; onPress: () => void }

export default function ChatItem({ person, onPress }: ChatItemProps) {
  const styles = useStyles();
  ...
}
```

**Rules**

- ❌ No raw numbers for size, spacing or font in styles — always wrap them: `ms(16)`, not `16`. (`0`, `1` hairlines, `flex: 1` and percentages are fine.)
- ❌ No `Dimensions.get('window')` in components — use `useResponsive()` so the UI updates on rotation.
- ✅ Prefer flexbox (`flex: 1`, `flexShrink: 1`, `gap`) over fixed widths/heights. Fixed heights only for things like avatars and buttons.
- ✅ Long text must not overflow: use `numberOfLines` + `flexShrink: 1` on names, previews and titles.
- ✅ Every `<Text>` gets `maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}` (build a shared `AppText` component for this) so large system fonts don't break layouts.
- ✅ Every screen is wrapped in `Screen`, which handles safe areas (notch, home bar) via `react-native-safe-area-context`.
- ✅ Screens with inputs (chat, forms) handle the keyboard with `KeyboardAvoidingView`.
- ✅ Lists use `FlatList`, never `ScrollView` + `map`, so long chats stay fast.
- ✅ On tablets (`isTablet`), keep lists/forms at `contentWidth` centred instead of stretching edge to edge.
- ✅ Test every new screen on: small phone (320 × 568), normal phone (360–393 wide), large phone (430 × 932), landscape, and a tablet (768 × 1024).

---

## 5. Creating a new component

Only after §1 step 5. Rules:

- **Presentational only.** Components receive data through props and report actions through callbacks (`onPress`, `onChange`). No socket calls, API calls or global state inside `components/` — that belongs in `hooks/` or `screens/`.
- **Variants, not copies.** Differences in look go in a `variant` prop (`'primary' | 'ghost' | 'text' | 'danger'`) or a `size` prop — never a new component.
- **Tokens only.** No raw colours or sizes (see §3).
- **Typed.** Exported `XxxProps` interface, union types for variants, no `any` (see §0a).
- **Responsive.** All sizes via `responsive.ts` helpers through `makeStyles` (see §4a).
- **Sensible defaults.** A component should render correctly with only its required props.
- **Style passthrough.** Accept `className` (web) / `style` (mobile) so a screen can adjust spacing without editing the component.
- **Accessible.** Icon-only buttons need `aria-label` (web) / `accessibilityLabel` (mobile).
- **Match the design file.** Same name, same props as the *Components* tab of `hive-chat-ui.html`.
- **Register it.** Export from `components/index.ts` and add a row to §6.

---

## 6. Component registry

Update this table whenever a component is added, renamed or gains a new prop/variant.
Status: `planned` = in the design file only · `web` / `mobile` / `both` = built in that app.

### utils
| Utility | What it gives you | Status |
|---|---|---|
| `types/chat.ts` | `ChatMessage`, `NewMessagePayload`, `ServerToClientEvents`, `ClientToServerEvents` | mobile |
| `utils/responsive.ts` | `useResponsive()`, `makeStyles()`, `s` `vs` `ms` `fs` `wp` `hp` `select`, breakpoints, `MAX_FONT_MULTIPLIER` | mobile |

### ui
| Component | Key props | Status |
|---|---|---|
| `AppText` | `variant`, `color`, `numberOfLines` — caps system font scaling | planned |
| `Icon` | `name`, `size`, `strokeWidth` | planned |
| `Avatar` | `person`, `size`, `online`, `ring: 'new' \| 'seen'`, `icon` — hexagon shape | planned |
| `Logo` | `size` | planned |
| `Button` | `label`, `variant: 'primary' \| 'ghost' \| 'text' \| 'danger'`, `icon`, `disabled`, `onPress` | planned |
| `IconButton` | `icon`, `variant: 'plain' \| 'fill' \| 'accent'`, `onPress`, `label` (a11y) | planned |
| `TextField` | `label`, `value`, `placeholder`, `prefix`, `icon`, `focused`, `onChange` | planned |
| `OTPInput` | `value`, `length`, `onChange` | planned |
| `SearchBar` | `placeholder`, `value`, `onChange` | planned |
| `Chips` | `items: [{label, count}]`, `active`, `onChange` | planned |
| `Badge` | `count`, `muted` | planned |
| `Toggle` / `Radio` / `Check` | `on`, `onChange` | planned |
| `Fab` | `icon`, `onPress` — hexagon | planned |
| `Keypad` | `onKey` | planned |

### layout
| Component | Key props | Status |
|---|---|---|
| `Screen` | `children`, `wallpaper` — safe area + background | planned |
| `AppBar` | `title`, `sub`, `onBack`, `actions: [{icon, onPress}]`, `large` | planned |
| `TabBar` | `active: 'chats' \| 'buzz' \| 'calls' \| 'hives' \| 'me'`, `onChange` — floating pill | planned |
| `Sheet` | `title`, `open`, `onClose`, `children` — bottom sheet | planned |
| `SectionTitle` | `title` | planned |
| `SettingsGroup` / `SettingsRow` | `icon`, `color`, `title`, `sub`, `value`, `right`, `onPress` | planned |
| `ProfileHeader` | `person`, `sub`, `size` | planned |
| `QuickActions` | `items: [{icon, label, onPress}]` | planned |

### chat
| Component | Key props | Status |
|---|---|---|
| `ChatItem` | `person`, `message`, `time`, `unread`, `tick`, `muted`, `pinned`, `typing`, `sender`, `onPress` | planned |
| `ContactRow` | `person`, `sub`, `checked`, `right`, `onPress` | planned |
| `CallItem` | `person`, `direction: 'in' \| 'out'`, `missed`, `time`, `video`, `count` | planned |
| `ChatHeader` | `person`, `status`, `onBack`, `onCall`, `onVideo`, `onInfo` | planned |
| `Bubble` | `dir: 'in' \| 'out'`, `text`, `time`, `tick: 'sent' \| 'delivered' \| 'read'`, `sender`, `quote`, `reactions`, `grouped`, `image`, `voice`, `doc`, `link` | planned |
| `DateChip` | `label` | planned |
| `SystemNote` | `text`, `icon` | planned |
| `Composer` | `state: 'idle' \| 'typing' \| 'recording'`, `value`, `replyTo`, `onChange`, `onSend`, `onAttach`, `onRecord` | planned |
| `AttachGrid` | `onPick` | planned |
| `ReactionBar` | `active`, `onPick` | planned |
| `MessageMenu` | `items`, `onPick` | planned |
| `BuzzCard` | `person`, `background`, `label`, `onPress` | planned |
| `CallButton` | `icon`, `variant: 'default' \| 'on' \| 'end' \| 'ok'`, `big`, `label` | planned |

### feedback
| Component | Key props | Status |
|---|---|---|
| `Banner` | `text`, `variant: 'accent' \| 'warn'`, `icon` | planned |
| `EmptyState` | `icon`, `title`, `text`, `action` | planned |
| `Typing` | — | planned |

---

## 7. Definition of done for any UI change

- [ ] Checked the registry first; no duplicate component was created.
- [ ] All new files are `.ts` / `.tsx`, props are typed, no `any`; `npm run check` passes.
- [ ] Only tokens used — no raw colours/sizes in components.
- [ ] Sizes go through `responsive.ts`; checked on small phone, large phone, landscape and tablet.
- [ ] New/changed component exported from `components/index.ts`.
- [ ] Registry table in this file updated (name, props, status).
- [ ] Screen matches its mockup in `Claude outputs/hive-chat-ui.html`.
- [ ] Primary colour is Ocean (`colors.accent` = `#3D8BFF`) via tokens — no other brand colour, no raw hex.
- [ ] If the component exists on both platforms, both have the same name and props.

## 8. Don'ts

- ❌ Designing a screen without checking `hive-chat-ui.html`, or using a primary colour other than Ocean `#3D8BFF`.
- ❌ `.js` / `.jsx` source files, `any`, `as any`, `@ts-ignore`.
- ❌ Copying a component to tweak it — add a prop/variant instead.
- ❌ Inline one-off UI in a screen that already exists as a component.
- ❌ Hardcoded hex colours, font sizes or radii.
- ❌ Raw pixel numbers in styles or `Dimensions.get()` in components — use `responsive.ts`.
- ❌ API/socket calls inside `components/`.
- ❌ Deep imports like `components/ui/Button/Button.tsx` — import from `components`.
