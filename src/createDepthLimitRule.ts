import { GraphQLError, ValidationRule, FieldNode } from "graphql";
import { DepthLimitOptions } from "./types";

export function createDepthLimitRule(
  options: DepthLimitOptions
): ValidationRule {
  const { maxDepth, ignoreIntrospection = true, message } = options;

  if (maxDepth < 1) {
    throw new Error("maxDepth must be >= 1");
  }

  return (context) => {
    let depth = 0;
    let hasError = false;
    let introspectionDepth = 0;

    return {
      Field: {
        enter(node: FieldNode) {
          const isIntrospectionField =
            ignoreIntrospection && node.name.value.startsWith("__");

          if (isIntrospectionField) {
            introspectionDepth++;
            return;
          }

          if (introspectionDepth > 0) {
            return;
          }

          depth++;

          if (depth > maxDepth && !hasError) {
            hasError = true;
            context.reportError(
              new GraphQLError(
                message?.(depth, maxDepth) ??
                  `Query depth ${depth} exceeds max depth ${maxDepth}`
              )
            );
          }
        },

        leave(node: FieldNode) {
          const isIntrospectionField =
            ignoreIntrospection && node.name.value.startsWith("__");

          if (isIntrospectionField) {
            introspectionDepth--;
            return;
          }

          if (introspectionDepth > 0) {
            return;
          }

          depth--;
        },
      },
    };
  };
}
