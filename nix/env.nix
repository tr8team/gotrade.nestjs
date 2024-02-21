{ pkgs, packages }:
with packages;
{
  system = [
    coreutils
    sd
    bash
    gomplate
    findutils
  ];

  dev = [
    pls
    git
    yq-go
    jq
  ];

  infra = [
    mirrord
    helm
    kubectl
    k3d
    tilt
    docker
  ];

  main = [
    node
    pnpm
    infisical
    doppler
  ];

  lint = [
    # core
    treefmt
    hadolint
    helm-docs
    gitlint
    shellcheck
    sg
  ];

  ci = [
    wrangler
    node
    sg
    docker
    helm
    yq-go
    jq
    kubectl
    k3d
    tilt
  ];

}
