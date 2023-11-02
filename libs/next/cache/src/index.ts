import env from '@env/server';
import { VercelKV, createClient } from '@vercel/kv';

export class Cache {
  public kv: VercelKV;

  constructor(url?: string, token?: string) {
    const kvUrl = url || env.KV_REST_API_URL;
    const kvToken = token || env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      throw new Error('Error with KV environment variables');
    }

    this.kv = createClient({
      url: kvUrl,
      token: kvToken,
    });
  }
}
