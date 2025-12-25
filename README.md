## 📘 react-intent-engine-z

- Intent-first orchestration engine for React
- Decouple UI from async flows, side effects, and business logic.

---

#### ✨ Why react-intent-engine-z?

- Modern React apps often suffer from:

- Business logic leaking into components

- Complex async flows spread across hooks

- Hard-to-test side effects

- Overloaded global stores

- react-intent-engine solves this by introducing an intent-driven architecture:

  - Components declare what they want to do — the engine decides how it happens.

- Works great with:

  - react-scoped-store

  - React Query / TanStack Query

  - Hexagonal / DDD architectures

---

#### 📦 Installation
```ts
npm install react-intent-engine-z use-sync-external-store
```

- use-sync-external-store is required for React 17 compatibility.

---

#### 🧠 Mental Model
```ts
UI
 └─ emit intent
        ↓
Intent Engine
 ├─ async orchestration
 ├─ business rules
 └─ side effects
 ```

---

#### 🚀 Basic Usage
##### 1️⃣ Create engine

```ts
import { createIntentEngine } from "react-intent-engine-z"

export const engine = createIntentEngine({
  initialState: {
    auth: {
      user: null,
      loading: false,
    },
  },
  effects: {
    auth: {
      login: async ({ email, password }) => {
        await new Promise(r => setTimeout(r, 500))
        return { id: 1, email }
      },
    },
  },
})
```

##### 2️⃣ Register intent handlers
```ts
engine.on("auth.login.submit", async (intent, ctx) => {
  ctx.set("auth.loading", true)

  const user = await ctx.effects.auth.login(intent.payload)

  ctx.set("auth.user", user)
  ctx.set("auth.loading", false)
})
```

##### 3️⃣ Provide engine to React
```ts
import { IntentProvider } from "react-intent-engine-z"

<IntentProvider engine={engine}>
  <App />
</IntentProvider>
```

##### 4️⃣ Emit intent from UI
```ts
import { useIntent, useIntentState } from "react-intent-engine-z"

function LoginButton() {
  const emit = useIntent()
  const loading = useIntentState(s => s.auth.loading)

  return (
    <button
      disabled={loading}
      onClick={() =>
        emit({
          type: "auth.login.submit",
          payload: { email: "a@b.com", password: "123" },
        })
      }
    >
      Login
    </button>
  )
}
```

- UI components never call APIs or use cases directly.

##### 🔄 Intent Status
- Track lifecycle state of an intent:
```ts
import { useIntentStatus } from "react-intent-engine-z"

const status = useIntentStatus("auth.login.submit")
// idle | pending | success
```

---

#### 🧩 Combine with react-scoped-store
```ts
const useLoginStore = createScopedStore(() => ({
  email: "",
  password: "",
}))

function LoginForm() {
  const { email, password } = useLoginStore()
  const emit = useIntent()

  return (
    <form
      onSubmit={() =>
        emit({
          type: "auth.login.submit",
          payload: { email, password },
        })
      }
    />
  )
}
```

- react-scoped-store → local UI state

- react-intent-engine → async flow & orchestration

---

#### 🧪 Testing (headless)
- Intent logic can be tested without React:
```ts
await engine.emit({
  type: "auth.login.submit",
  payload: { email: "a@b.com", password: "123" },
})

expect(engine.store.getState().auth.user).toBeDefined()
```

---

#### 🧠 When to use?

- Use react-intent-engine when your app has:

  - Complex async workflows

  - Business logic outside UI

  - Multiple side effects per action

  - Large or growing teams

  - Hexagonal / DDD-inspired architecture
  
  - This library focuses on behavior and flow, not data fetching or UI state.
---

#### 📜 License

MIT