resource "aws_iam_role" "api" {
  name = "${var.proyecto}-api-${var.ambiente}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "api" {
  name = "${var.proyecto}-api-${var.ambiente}"
  role = aws_iam_role.api.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:*", "logs:*"]
      Resource = "*"
    }]
  })
}
