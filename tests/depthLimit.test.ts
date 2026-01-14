import { describe, it, expect } from "vitest";
import { parse, validate, specifiedRules } from "graphql";
import { createDepthLimitRule } from "../src/createDepthLimitRule";

const schemaSDL = `
  type Query {
    users: [User!]
  }

  type User {
    id: ID!
    posts: [Post!]
  }

  type Post {
    id: ID!
    comments: [Comment!]
  }

  type Comment {
    id: ID!
  }
`;

import { buildSchema } from "graphql";

const schema = buildSchema(schemaSDL);

describe("createDepthLimitRule", () => {
  it("allows query within max depth", () => {
    const query = `
      query {
        users {
          id
        }
      }
    `;

    const errors = validate(schema, parse(query), [
      ...specifiedRules,
      createDepthLimitRule({ maxDepth: 3 }),
    ]);

    expect(errors).toHaveLength(0);
  });

  it("blocks query exceeding max depth", () => {
    const query = `
      query {
        users {
          posts {
            comments {
              id
            }
          }
        }
      }
    `;

    const errors = validate(schema, parse(query), [
      ...specifiedRules,
      createDepthLimitRule({ maxDepth: 2 }),
    ]);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain("exceeds max depth");
  });

  it("ignores introspection fields", () => {
    const query = `
      {
        __schema {
          types {
            name
          }
        }
      }
    `;

    const errors = validate(schema, parse(query), [
      ...specifiedRules,
      createDepthLimitRule({ maxDepth: 1 }),
    ]);

    expect(errors).toHaveLength(0);
  });

  it("uses custom error message", () => {
    const query = `
      query {
        users {
          posts {
            id
          }
        }
      }
    `;

    const errors = validate(schema, parse(query), [
      ...specifiedRules,
      createDepthLimitRule({
        maxDepth: 2,
        message: (current, max) => `Depth ${current} > ${max}`,
      }),
    ]);

    expect(errors[0].message).toBe("Depth 3 > 2");
  });
  it("blocks query with deeply nested fragments", () => {
    const query = `
    query {
      user {
        ...UserFields
      }
    }

    fragment UserFields on User {
      profile {
        address {
          city
        }
      }
    }
  `;

    const errors = validate(schema, parse(query), [
      createDepthLimitRule({ maxDepth: 2 }),
    ]);

    expect(errors).toHaveLength(1);
  });
  it("allows reused fragments within depth limit", () => {
    const query = `
    query {
      user1: user {
        ...UserFields
      }
      user2: user {
        ...UserFields
      }
    }

    fragment UserFields on User {
      id
      name
    }
  `;

    const errors = validate(schema, parse(query), [
      createDepthLimitRule({ maxDepth: 2 }),
    ]);

    expect(errors).toHaveLength(0);
  });

  it("validates all operations when no operationName is provided", () => {
    const query = `
    query Shallow {
      user {
        id
      }
    }

    query Deep {
      user {
        profile {
          address {
            city
          }
        }
      }
    }
  `;

    const errors = validate(schema, parse(query), [
      createDepthLimitRule({ maxDepth: 3 }),
    ]);

    expect(errors).toHaveLength(1);
  });
});
