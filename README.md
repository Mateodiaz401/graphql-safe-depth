# graphql-safe-depth

![npm](https://img.shields.io/npm/v/graphql-safe-depth)
![downloads](https://img.shields.io/npm/dm/graphql-safe-depth)
![license](https://img.shields.io/npm/l/graphql-safe-depth)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)

A lightweight and dependency-free GraphQL validation rule to limit query depth.

Designed for learning, experimentation, and production APIs that need a simple
and predictable way to prevent overly deep GraphQL queries.

---

## 🤔 Why graphql-safe-depth?

Most GraphQL depth-limit solutions either:

- Count total fields instead of real execution depth
- Break with introspection queries
- Are hard to reason about or customize

**graphql-safe-depth** focuses on:

- ✅ Predictable execution depth calculation
- 🧠 Real resolver path depth (not total fields)
- 🔍 Safe introspection handling
- 🧩 Fragment-friendly validation
- ⚡ Minimal and dependency-free core

---

## ✨ Features

- ✅ Limits GraphQL query depth
- 🚫 Prevents malicious or accidental deep queries
- 🧠 Counts **actual execution depth**, not total fields
- 🔍 Ignores introspection fields by default
- 🧩 Works with fragments
- ⚡ Zero external dependencies
- 🧪 Fully tested
- 🛠 Written in TypeScript

---

## 📦 Installation

```bash
npm i graphql-safe-depth
# or
yarn add graphql-safe-depth
```

## 🚀 Usage

## Apollo Server (Node.js)

```bash
import { ApolloServer } from "apollo-server";
import { createDepthLimitRule } from "graphql-safe-depth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createDepthLimitRule({ maxDepth: 3 }),
  ],
});

```

## Apollo Server (NestJS)

```bash
import { createDepthLimitRule } from "graphql-safe-depth";

GraphQLModule.forRoot({
  autoSchemaFile: true,
  validationRules: [
    createDepthLimitRule({ maxDepth: 5 }),
  ],
});

```

## ⚙️ Options

```bash
createDepthLimitRule({
  maxDepth: number;
  ignoreIntrospection?: boolean;
  message?: (depth: number, maxDepth: number) => string;
});
```

### maxDepth (required)

Maximum allowed depth for a query

```bash
createDepthLimitRule({ maxDepth: 3 });
```

```bash
ignoreIntrospection  (default: true)
```

If true , GraphQL introspection fields
(**schema, **type, \_\_typename) are ignored when calculating depth.

```bash
createDepthLimitRule({
  maxDepth: 3,
  ignoreIntrospection: false,
});
```

### message (optional)

Custom error message generator.

```bash
createDepthLimitRule({
  maxDepth: 3,
  message: (depth, max) =>
    `Query depth ${depth} exceeds the allowed maximum of ${max}`,
});

```

## 📐 How depth is calculated

Depth is calculated based on the deepest execution path, not the number of fields.

✅ Valid query (depth = 3)

```bash
query {
  user {
    profile {
      name
    }
  }
}
```

## ❌ Invalid query (depth = 4)

```bash
query {
  user {
    profile {
      address {
        city
      }
    }
  }
}
```

## 🔐 Security note

This library protects against overly deep queries that may cause
performance issues or denial-of-service scenarios.

It is recommended to combine it with:

Query complexity limits

Proper authentication & authorization

Rate limiting

## 🧪 Testing

```bash
npm test
or
yarn test
```

## 📄 License

MIT © Mateo Diaz
