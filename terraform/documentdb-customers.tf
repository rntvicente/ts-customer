resource "aws_docdb_cluster" "customers" {
  cluster_identifier = "${var.environment}-customers"
  master_username    = "${var.db_username}"
  master_password    = "${var.db_password}"
  skip_final_snapshot = true
}

resource "aws_ssm_parameter" "docdb_customers_cluster_id" {
  name  = "${var.environment}-documentdb-customers-table"
  type  = "String"
  value = "${aws_docdb_cluster.customers.id}"
}
