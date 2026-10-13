output "url_api" {
  value = aws_lambda_function_url.api.function_url
}

output "bucket_comprobantes" {
  value = aws_s3_bucket.comprobantes.bucket
}
