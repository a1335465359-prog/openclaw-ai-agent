# 飞书发图流程 SOP

## 核心规则
严禁把本地路径当作"图片回复"直接发到聊天（对方看不到）

## 固定流程
1. 调飞书 `im/v1/images` 上传本地图片 → 拿到 `image_key`
2. 调飞书 `im/v1/messages` 发送 `msg_type=image`

## 腾讯云 COS 方案
1. 上传到 COS
2. 发送 `msg_type=image` (image_url 模式)

## 发送前自检
- 文件存在且可读
- chat_id 是当前会话群
- API 返回 code=0 后再回"已发送"
