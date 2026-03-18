# 设置 UTF-8 编码
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$headers = @{
  "X-API-Key" = "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3"
  "Content-Type" = "application/json; charset=utf-8"
}

# 手动构建 JSON 避免 ConvertTo-Json 编码问题
$body = '{"channel":"FEISHU","title":"测试标题","content":"Hello Feishu!"}'

Write-Host "Sending request..."
Write-Host "Body: $body"

try {
  $response = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/v1/notify/send" -Headers $headers -Body $body
  Write-Host "Response: $($response | ConvertTo-Json -Depth 10)"
} catch {
  Write-Host "Error: $($_.Exception.Message)"
  Write-Host "Response: $($_.Exception.Response)"
}
