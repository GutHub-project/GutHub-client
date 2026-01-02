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

// 3. Metro resolver - monorepo workspace 패키지 해석
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // @repo 패키지들 - 기본 로직으로 처리 (pnpm symlink 활용)
  // Metro가 자동으로 node_modules 경로에서 찾음
  if (moduleName.startsWith('@repo/')) {
    return context.resolveRequest(context, moduleName, platform);
  }

  // 기본 resolver 사용
  return context.resolveRequest(context, moduleName, platform);
};

// 4. Enable package exports 및 proper resolution
config.resolver.unstable_enablePackageExports = true;

// 5. 계층적 조회 활성화 (pnpm 호환)
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
