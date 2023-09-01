{ pkgs, atomi, atomi_classic, pkgs-2305, pkgs-may-13-23, pkgs-aug-01-23 }:
let
  all = {
    atomipkgs_classic = (
      with atomi_classic;
      {
        inherit
          sg;
      }
    );
    atomipkgs = (
      with atomi;
      {
        inherit
          infisical
          pls
          mirrord;
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
atomipkgs_classic //
nix-2305 //
may-13-23 //
aug-01-23
