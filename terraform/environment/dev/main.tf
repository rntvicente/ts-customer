module "ts-customer" {
  source = "../../"
  environment = "${var.environment}"
  write_capacity = 1
  read_capacity = 1
  db_username = "customer"
  db_password = "customer"
}