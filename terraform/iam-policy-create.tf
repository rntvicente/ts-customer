resource "aws_iam_policy" "create_policy" {
  name = "${var.environment}-create-policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "docdb:Insert"
      ],
      "Effect": "Allow",
      "Resource": "${aws_docdb_cluster.customers.arn}"
    },
    {
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": "*"
    }    
  ]
}
EOF
}