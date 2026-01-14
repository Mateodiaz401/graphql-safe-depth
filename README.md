# graphql-depth-limit-lite

A lightweight and dependency-free GraphQL validation rule to limit query depth.

Designed for learning, experimentation, and production APIs that need a simple
and predictable way to prevent overly deep GraphQL queries.

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
npm install graphql-depth-limit-lite
or
yarn add graphql-depth-limit-lite
```

## Usage

## Apollo Server (Node.js)

```bash
import { ApolloServer } from "apollo-server";
import { createDepthLimitRule } from "graphql-depth-limit-lite";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createDepthLimitRule({ maxDepth: 5 }),
  ],
});

```

## Apollo Server (NestJS)

```bash
import { createDepthLimitRule } from "graphql-depth-limit-lite";

GraphQLModule.forRoot({
  autoSchemaFile: true,
  validationRules: [
    createDepthLimitRule({ maxDepth: 5 }),
  ],
});

```

# Options

```bash
createDepthLimitRule({
  maxDepth: number;
  ignoreIntrospection?: boolean;
  message?: (depth: number, maxDepth: number) => string;
});
```

`bash maxDepth ` (required)

Maximum allowed depth for a query

```bash
createDepthLimitRule({ maxDepth: 3 });
```

```bash
ignoreIntrospection  (default: true)
```

If true , GraphQL introspection fields (**schema, **type, \_\_typename)
are ignored when calculating depth.

```bash
createDepthLimitRule({
  maxDepth: 3,
  ignoreIntrospection: false,
});
```

message (optional)

Custom error message generator.

```bash
createDepthLimitRule({
  maxDepth: 3,
  message: (depth, max) =>
    `Query depth ${depth} exceeds the allowed maximum of ${max}`,
});

```

How depth is calculated

Depth is calculated based on the deepest execution path, not the number of fields.

Valid query (depth = 3)

```bash
query {
  user {
    profile {
      name
    }
  }
}
```

Invalid query (depth = 4)

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

Testing

```bash
npm test
or
yarn test
```
