export interface DepthLimitOptions {
  maxDepth: number;
  ignoreIntrospection?: boolean;
  message?: (currentDepth: number, maxDepth: number) => string;
}
