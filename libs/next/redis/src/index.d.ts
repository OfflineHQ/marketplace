import { VercelKV } from '@vercel/kv';
export declare class NextRedis {
  kv: VercelKV;
  constructor(url?: string, token?: string);
}
