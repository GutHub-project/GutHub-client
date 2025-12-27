// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Force resolve workspace packages to their source files
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @repo packages by pointing to their source
  if (moduleName === '@repo/user/components') {
    return {
      filePath: path.resolve(workspaceRoot, 'packages/user/src/components/index.ts'),
      type: 'sourceFile',
    };
  }
  if (moduleName === '@repo/user/hooks') {
    return {
      filePath: path.resolve(workspaceRoot, 'packages/user/src/hooks/index.ts'),
      type: 'sourceFile',
    };
  }
  if (moduleName === '@repo/main-feature/apis/auth') {
    return {
      filePath: path.resolve(workspaceRoot, 'packages/main-feature/src/apis/auth/index.ts'),
      type: 'sourceFile',
    };
  }
  if (moduleName === '@repo/main-feature/components') {
    return {
      filePath: path.resolve(workspaceRoot, 'packages/main-feature/src/components/index.ts'),
      type: 'sourceFile',
    };
  }
  if (moduleName === '@repo/shared') {
    return {
      filePath: path.resolve(workspaceRoot, 'packages/shared/src/index.ts'),
      type: 'sourceFile',
    };
  }

  // Fallback to default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// 4. Disable package exports (we're manually resolving)
config.resolver.unstable_enablePackageExports = false;

// 5. Disable hierarchical lookup to prevent pnpm issues
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
