## 📘 react-intent-engine-z

[![NPM](https://img.shields.io/npm/v/react-intent-engine-z.svg)](https://www.npmjs.com/package/react-intent-engine-z)
![Downloads](https://img.shields.io/npm/dt/react-intent-engine-z.svg)

---

**react-intent-engine-z** is a lightweight intent orchestration layer   
+ Not a state manager, not an event bus.  
+ An **intent-first orchestration engine for React**.  
+ Decouples UI from async flows, side effects, and business logic.  

[Live Example](https://codesandbox.io/p/sandbox/kjstrf)

---

### ✨ Why/When Use It

- Separate business logic from UI
- Handle async flows declaratively
- Easy testing of intents
- Supports multiple engines & scoped state
- Complex user flows (login → fetch → redirect → notify)
- Business logic should live outside components
- Logic must be testable without React
- Works with React 17+, React Query, DDD-style architectures
  
---

### 📦 Installation

```bash
npm install react-intent-engine-z use-sync-external-store
```
- `use-sync-external-store` is required for React 17 compatibility.

---

### 🧠 Mental Model

```bash
UI Component
 └─ emits intent
      ↓
Intent Engine
 ├─ async orchestration
 ├─ business rules
 └─ side effects
```

---

### 🚀 Basic Usage

##### 1️⃣ Create Engine

```ts
import { createIntentEngine } from "react-intent-engine-z"
// import { navigate } from "react-router-dom" // React Router v6

export const authEngine = createIntentEngine({
  initialState: { auth: { user: null, loading: false } },
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

##### 2️⃣ Register Handlers

```ts
authEngine.on("auth.login.submit", async (intent, ctx) => {
  try {
    ctx.set({ auth: { ...ctx.get().auth, loading: true, error: null } })

    // ✅ Common pattern: call effect
    const user = await ctx.effects.auth.login(intent.payload)

    // Update store
    ctx.set({ auth: { ...ctx.get().auth, user, loading: false } })

    // Navigate after success
    // navigate("/dashboard")
  } catch (err: any) {
    ctx.set({ auth: { ...ctx.get().auth, error: err.message, loading: false } })
  }
})
```
##### 3️⃣ Provide Engine to React

```ts
import { IntentProvider } from "react-intent-engine-z"

<IntentProvider engine={authEngine}>
  <LoginButton />
</IntentProvider>
```

##### 4️⃣ Emit Intent from UI

```tsx
import { useIntent, useIntentState } from "react-intent-engine-z"

function LoginButton() {
  const emit = useIntent()
  const loading = useIntentState(s => s.auth.loading)

  return (
    <button
      disabled={loading}
      onClick={() => emit({
        type: "auth.login.submit",
        payload: { email: "a@b.com", password: "123" }
      })}
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  )
}
```

---

### 🔄 Track Intent Status
```ts
import { useIntentStatus } from "react-intent-engine-z"

const status = useIntentStatus("auth.login.submit") // idle | pending | success
```

---

### 🧩 Middleware Example
```ts
import { Middleware, createIntentEngine } from "react-intent-engine-z"

// Logs every intent
const logger: Middleware = async (intent, next, ctx) => {
  console.log("[Logger]", intent.type, intent.payload)
  await next()
}

// Blocks auth intents if not logged in
const authGuard: Middleware = async (intent, next, ctx) => {
  const user = ctx.store.getState().auth.user
  if (intent.type.startsWith("auth.") && !user) {
    console.warn("[AuthGuard] Not logged in, blocking:", intent.type)
    return
  }
  await next()
}

const engine = createIntentEngine({
  initialState: { auth: { user: null, loading: false } },
  effects: {
    auth: { login: async () => ({ id: 1, email: "a@b.com" }) }
  },
  middleware: [logger, authGuard]
})

```

---

### 🧪 Testing (headless)
```ts
await engine.emit({
  type: "auth.login.submit",
  payload: { email: "a@b.com", password: "123" }
})

expect(engine.store.getState().auth.user).toBeDefined()
```

- separates business logic and side effects from UI, making intents fully testable without rendering React components.

---

### ⚡ Multiple Engines
```tsx
import { IntentProvider } from "react-intent-engine-z"

<IntentProvider engine={authEngine}>
  <LoginForm />
</IntentProvider>

<IntentProvider engine={notifEngine}>
  <NotificationCenter />
</IntentProvider>
```

- Each engine is scoped
- Supports role-based UI and multiple async flows

---

### 🔍 Comparison: Intent Engine vs Redux vs Event Bus vs CQRS / Command Bus


| Criteria          | **react-intent-engine-z**         | **Redux**                | **Event Bus**        | **CQRS / Command Bus**         |
| ----------------- | --------------------------------- | ------------------------ | -------------------- | ------------------------------ |
| Primary goal      | Orchestrate **behavior**          | Manage **state**         | Broadcast events     | Handle **commands & queries**  |
| Core focus        | **Intent → flow → side effects**  | State → reducer → UI     | Event → listeners    | Command → handler              |
| What UI calls     | `emit(intent)`                    | `dispatch(action)`       | `emit(event)`        | `dispatch(command)`            |
| Where logic lives | **Intent handlers**               | Reducers / middleware    | Scattered listeners  | Command handlers               |
| Execution order   | Controlled                        | Controlled (middleware)  | ❌ Not guaranteed    | Controlled                     |
| Async flow        | ✅ Built-in                       | Via thunk / saga         | Ad-hoc               | ✅ First-class                  |
| Side effects      | First-class                       | Middleware               | Ad-hoc               | First-class                    |
| State required    | ❌ Optional                       | ✅ Required              | ❌                    | ❌                             |
| Type safety       | ✅ Intent-based                   | Action-based             | ❌ Weak               | ✅ Strong                      |
| Testability       | ✅ Easy (headless)                | Medium                   | ❌ Hard               | ✅ Easy                        |
| Coupling          | Low                               | Medium                   | **High**             | Low                            |
| Learning curve    | Low → Medium                      | High                     | Low                  | High                           |
| Fit for React     | ✅ Excellent                      | ✅ Excellent              | ⚠️ Risky             | ⚠️ Overkill                    |

---

### 📜 License
MIT