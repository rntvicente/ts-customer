resource "aws_iam_policy_attachment" "create_iam_attachment" {
  name = "${var.environment}-create-iam-attachment"
  roles = ["${aws_iam_role.create_iam_role.name}"]
  policy_arn = "${aws_iam_policy.create_policy.arn}"
}