{ pkgs, atomi, pkgs-2305, pkgs-may-13-23, pkgs-aug-01-23 }:
let
  all = {
    atomipkgs = (
      with atomi;
      {
        inherit
          infisical
          pls
          mirrord
          sg;
      }
    );
    nix-2305 = (
      with pkgs-2305;
      {
        inherit
          k3d;
      }
    );
    may-13-23 = (
      with pkgs-may-13-23;
      {
        inherit
          tilt;
      }
    );
    aug-01-23 = (
      with pkgs-aug-01-23;
      {
        inherit
          coreutils
          findutils
          sd
          bash
          git
          yq-go
          jq
          wrangler
          gomplate
          doppler

          # lint
          treefmt
          helm-docs
          gitlint
          hadolint
          shellcheck

          #infra
          kubectl
          docker;
        helm = kubernetes-helm;

        eslint = nodePackages_latest.eslint;
        node = nodejs_18;
        npm = nodePackages.npm;
        pnpm = nodePackages.pnpm;
      }
    );
  };
in
with all;
atomipkgs //
nix-2305 //
may-13-23 //
aug-01-23
