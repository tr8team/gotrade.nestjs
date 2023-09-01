module "<% landscape %>" {

  source = "../../../modules/nestjs"

  providers = {
    aws         = aws.prod_sg
    neon        = neon.main
    planetscale = planetscale.main
    upstash     = upstash.main
  }

  doppler_project_name = module.doppler.name

  landscape = local.landscapes.<% landscape %>.slug
  platform  = local.platform
  service   = local.service

  planetscale_org = local.planetscale_org


  planetscale_region = local.planetscale_region
  neon_region        = local.neon_region
  s3_region          = local.sgRegion
  upstash_region     = local.upstash_region

  blob_stores = {
<% storages %>
  }
  mysqls = {
<% mysqls %>
  }
  postgresqls = {
<% postgresqls %>
  }
  redises = {
<% caches %>
  }
}
