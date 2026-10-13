resource "aws_s3_bucket" "comprobantes" {
  bucket = "${var.proyecto}-comprobantes-${var.ambiente}"
}

resource "aws_s3_bucket_public_access_block" "comprobantes" {
  bucket = aws_s3_bucket.comprobantes.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
