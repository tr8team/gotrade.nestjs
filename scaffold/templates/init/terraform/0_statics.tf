locals {
  landscapes = {
    staging = {
      slug = "staging"
      name = "Staging"
    }
    admin = {
      slug = "admin"
      name = "Admin"
    }
    prod_indo = {
      slug = "prod-indo"
      name = "Production Indo"
    }
    prod_global = {
      slug = "prod-global"
      name = "Production Global"
    }
    local = {
      slug = "local"
      name = "Local"
    }
    test = {
      slug = "test"
      name = "Test"
    }
    local_prod = {
      slug = "local-prod"
      name = "Local Prod"
    }
    ci = {
      slug = "ci"
      name = "Continuous Integration"
    }
  }
}