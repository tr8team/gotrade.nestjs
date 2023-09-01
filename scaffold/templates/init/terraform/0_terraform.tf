terraform {
  required_version = ">= 1.1"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.13"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.12"
    }
    doppler = {
      source  = "DopplerHQ/doppler"
      version = "~> 1.2"
    }
    upstash = {
      source  = "upstash/upstash"
      version = "~> 1.4"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.2"
    }
    planetscale = {
      source  = "koslib/planetscale"
      version = "~> 0.6"
    }
  }
}
