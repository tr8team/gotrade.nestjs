terraform {
  backend "s3" {
    bucket         = "meta-terraform-backend"
    key            = "services/<% platform %>/<% service %>"
    region         = "ap-southeast-1"
    dynamodb_table = "meta-terraform-backend-state"
  }
}
