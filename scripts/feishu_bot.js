/**
 * 飞书群聊 AI 助手
 * 在飞书群聊中作为 AI 助手运行
 * 每日处理 100+ 条消息，消耗约 300 万 Token
 */

const https = require('https');

class FeishuBot {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.token = null;
  }

  async getToken() {
    const data = await this.request('POST', '/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: this.appId,
      app_secret: this.appSecret
    });
    this.token = data.tenant_access_token;
    return this.token;
  }

  async sendMessage(chatId, text) {
    if (!this.token) await this.getToken();
    
    return this.request('POST', '/open-apis/im/v1/messages?receive_id_type=chat_id', {
      receive_id: chatId,
      msg_type: 'text',
      content: JSON.stringify({ text })
    });
  }

  async sendImage(chatId, imageKey) {
    if (!this.token) await this.getToken();
    
    return this.request('POST', '/open-apis/im/v1/messages?receive_id_type=chat_id', {
      receive_id: chatId,
      msg_type: 'image',
      content: JSON.stringify({ image_key: imageKey })
    });
  }

  async uploadImage(imagePath) {
    if (!this.token) await this.getToken();
    
    // 简化版，实际需要 multipart upload
    return this.request('POST', '/open-apis/im/v1/images', {
      image_type: 'message',
      image: imagePath
    });
  }

  request(method, path, body) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: 'open.feishu.cn',
        path: path,
        method: method,
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type': 'application/json'
        }
      };
      const req = https.request(opts, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }
}

module.exports = { FeishuBot };
