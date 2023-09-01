{ formatter, pre-commit-lib, packages }:
pre-commit-lib.run {
  src = ./.;

  # hooks
  hooks = {
    # formatter
    treefmt = {
      enable = true;
      excludes = [ ".*scaffold/templates/.*" ".*infra/.*" "pnpm-lock.yaml" "Changelog.md" "CommitConventions.md" ".*schema.json" ];
    };
    # linters From https://github.com/cachix/pre-commit-hooks.nix
    shellcheck = {
      enable = false;
    };

    a-infisical = {
      enable = true;
      name = "Secrets Scanning";
      description = "Scan for possible secrets";
      entry = "${packages.infisical}/bin/infisical scan .";
      language = "system";
      pass_filenames = false;
    };

    a-config-schema = {
      enable = true;
      name = "Generate Config Schema";
      description = "Convert code schema into JSON schema for better completion";
      entry = "./node_modules/.bin/typescript-json-schema ./src/config/root.config.ts RootConfig -o config/app/schema.json";
      files = "src/config/.*";
      language = "system";
      pass_filenames = false;
    };

    a-helm-lint-api-chart = {
      enable = true;
      name = "Helm Lint API Chart";
      description = "Lints helm API charts";
      entry = "${packages.helm}/bin/helm lint -f infra/api_chart/values.yaml infra/api_chart";
      files = "infra/api_chart/.*";
      language = "system";
      pass_filenames = false;
    };

    a-helm-lint-migration-chart = {
      enable = true;
      name = "Helm Lint Migration Chart";
      description = "Lints helm migration charts";
      entry = "${packages.helm}/bin/helm lint -f infra/migration_chart/values.yaml infra/migration_chart";
      files = "infra/migration_chart/.*";
      language = "system";
      pass_filenames = false;
    };

    a-helm-lint-root-chart = {
      enable = true;
      name = "Helm Lint Root Chart";
      description = "Lints helm root charts";
      entry = "${packages.helm}/bin/helm lint -f infra/root_chart/values.yaml infra/root_chart";
      files = "infra/root_chart/.*";
      language = "system";
      pass_filenames = false;
    };


    a-gitlint = {
      enable = true;
      name = "Gitlint";
      description = "Lints git commit message";
      entry = "${packages.gitlint}/bin/gitlint --staged --msg-filename .git/COMMIT_EDITMSG";
      language = "system";
      pass_filenames = false;
      stages = [ "commit-msg" ];
    };


    a-enforce-gitlint = {
      enable = true;
      name = "Enforce gitlint";
      description = "Enforce atomi_releaser conforms to gitlint";
      entry = "${packages.sg}/bin/sg gitlint";
      files = "(atomi_release\\.yaml|\\.gitlint)";
      language = "system";
      pass_filenames = false;
    };

    a-shellcheck = {
      enable = true;
      name = "Shell Check";
      entry = "${packages.shellcheck}/bin/shellcheck";
      files = ".*sh$";
      language = "system";
      pass_filenames = true;
    };

    a-enforce-exec = {
      enable = true;
      name = "Enforce Shell Script executable";
      entry = "${packages.coreutils}/bin/chmod +x";
      files = ".*sh$";
      language = "system";
      pass_filenames = true;
    };

    a-hadolint = {
      enable = true;
      name = "Docker Linter";
      entry = "${packages.hadolint}/bin/hadolint";
      files = ".*Dockerfile$";
      language = "system";
      pass_filenames = true;
    };

    a-helm-docs = {
      enable = true;
      name = "Helm Docs";
      entry = "${packages.helm-docs}/bin/helm-docs";
      files = ".*";
      language = "system";
      pass_filenames = false;
    };

    a-config-sync = {
      enable = true;
      name = "Sync configurations to helm charts";
      entry = "${packages.bash}/bin/bash scripts/config-sync.sh";
      files = ".*config/app/.*";
      language = "system";
      pass_filenames = false;
    };

    a-eslint = {
      enable = true;
      name = "eslint";
      entry = "${packages.eslint}/bin/eslint --fix";
      files = "(src|apps|libs|test).*\.([mc]?js|[mc]?ts|tsx)$";
      excludes = [ ".*/(node_modules|dist)/.*" ".*helper.ts" ];
      language = "system";
      pass_filenames = true;
    };
  };

  settings = {
    treefmt = {
      package = formatter;
    };
  };
}
