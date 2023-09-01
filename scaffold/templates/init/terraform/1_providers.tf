provider "upstash" {
  alias   = "main"
  email   = data.doppler_secrets.generic.map.UPSTASH_EMAIL
  api_key = data.doppler_secrets.generic.map.UPSTASH_API_KEY
}

provider "neon" {
  alias   = "main"
  api_key = data.doppler_secrets.generic.map.NEON_TOKEN
}

provider "planetscale" {
  alias            = "main"
  service_token_id = data.doppler_secrets.generic.map.PLANETSCALE_SERVICE_TOKEN_ID
  service_token    = data.doppler_secrets.generic.map.PLANETSCALE_SERVICE_TOKEN
}

provider "cloudflare" {
  alias     = "main"
  api_token = data.doppler_secrets.generic.map.CLOUDFLARE_API_TOKEN
}


# AWS STAGING
provider "aws" {
  alias  = "staging_sg"
  region = local.sgRegion

  access_key = data.doppler_secrets.generic.map.AWS_STAGE_ACCESS_KEY_ID
  secret_key = data.doppler_secrets.generic.map.AWS_STAGE_ACCESS_KEY_SECRET
}

provider "aws" {
  alias  = "staging_indo"
  region = local.indoRegion

  access_key = data.doppler_secrets.generic.map.AWS_STAGE_ACCESS_KEY_ID
  secret_key = data.doppler_secrets.generic.map.AWS_STAGE_ACCESS_KEY_SECRET
}

# AWS PROD
provider "aws" {
  alias  = "prod_sg"
  region = local.sgRegion

  access_key = data.doppler_secrets.generic.map.AWS_PROD_ACCESS_KEY_ID
  secret_key = data.doppler_secrets.generic.map.AWS_PROD_ACCESS_KEY_SECRET
}

provider "aws" {
  alias  = "prod_indo"
  region = local.indoRegion

  access_key = data.doppler_secrets.generic.map.AWS_PROD_ACCESS_KEY_ID
  secret_key = data.doppler_secrets.generic.map.AWS_PROD_ACCESS_KEY_SECRET
}


# AWS DEV
provider "aws" {
  alias  = "dev_sg"
  region = local.sgRegion

  access_key = data.doppler_secrets.generic.map.AWS_DEV_ACCESS_KEY_ID
  secret_key = data.doppler_secrets.generic.map.AWS_DEV_ACCESS_KEY_SECRET
}

provider "aws" {
  alias  = "dev_indo"
  region = local.indoRegion

  access_key = data.doppler_secrets.generic.map.AWS_DEV_ACCESS_KEY_ID
  secret_key = data.doppler_secrets.generic.map.AWS_DEV_ACCESS_KEY_SECRET
}