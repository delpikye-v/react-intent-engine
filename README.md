## 📘 react-intent-engine-z

[![NPM](https://img.shields.io/npm/v/react-intent-engine-z.svg)](https://www.npmjs.com/package/react-intent-engine-z)
![Downloads](https://img.shields.io/npm/dt/react-intent-engine-z.svg)

---

An **intent-first orchestration engine for React**.  
Decouples UI from async flows, side effects, and business logic.  

[Live Example](https://codesandbox.io/p/sandbox/kjstrf)

---

### ✨ Why Use It

- Separate business logic from UI
- Handle async flows declaratively
- Easy testing of intents
- Supports multiple engines & scoped state
- Works with React 17+, React Query, DDD-style architectures

---

### 📦 Installation

```bash
npm install react-intent-engine-z use-sync-external-store
```
- use-sync-external-store is required for React 17 compatibility.

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
  ctx.set("auth.loading", true)
  const user = await ctx.effects.auth.login(intent.payload)
  ctx.set("auth.user", user)
  ctx.set("auth.loading", false)
})
```
##### 3️⃣ Provide Engine to React

```ts
import { IntentProvider } from "react-intent-engine-z"
<IntentProvider engine={authEngine}>
  <LoginForm />
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

### 📜 License
MIT