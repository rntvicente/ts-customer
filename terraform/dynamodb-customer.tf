resource "aws_dynamodb_table" "customers" {
  name = "${var.environment}-customers"
  hash_key = "id"
  attribute {
    name = "id"
    type = "S"
  }
  write_capacity = "${var.write_capacity}"
  read_capacity = "${var.read_capacity}"
}

resource "aws_ssm_parameter" "dynamodb_customers_table" {
  name = "${var.environment}-dynamodb-customers-table"
  type = "String"
  value = "${aws_dynamodb_table.customers.name}"
}