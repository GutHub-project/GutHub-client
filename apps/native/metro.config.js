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

// 3. Force Metro to use source files for workspace packages
config.resolver.unstable_enablePackageExports = false;

// 4. Resolve workspace packages to their source
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@repo/")) {
    const packageName = moduleName.split("/")[1];
    const subPath = moduleName.split("/").slice(2).join("/");

    const sourcePath = subPath
      ? path.join(workspaceRoot, "packages", packageName, "src", subPath)
      : path.join(workspaceRoot, "packages", packageName, "src", "index.ts");

    return {
      filePath: sourcePath,
      type: "sourceFile",
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

// 5. Disable hierarchical lookup to prevent pnpm issues
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
