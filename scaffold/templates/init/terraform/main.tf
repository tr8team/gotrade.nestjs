module "doppler" {

  source = "../../../modules/doppler"

  main_secrets_project = local.main_secrets

  landscapes = {
<% landscapes %>
  }

  platform = local.platform
  service  = local.service

}
