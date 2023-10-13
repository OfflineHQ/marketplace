import { createClient } from '@vercel/kv';
import env from '@env/server';

export class Cache {
  private client;

  constructor(url?: string, token?: string) {
    const kvUrl = url || env.KV_REST_API_URL;
    const kvToken = token || env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      throw new Error('Error with KV environment variables');
    }

    this.client = createClient({
      url: kvUrl,
      token: kvToken,
    });
  }

  private async handleOperation(
    operation: Promise<unknown>,
    operationName: string,
  ) {
    try {
      return await operation;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error with redis operation ${operationName} : ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  async get(key: string) {
    return this.handleOperation(this.client.get(key), 'get');
  }

  async set(key: string, value: unknown) {
    return this.handleOperation(this.client.set(key, value), 'set');
  }

  async del(key: string) {
    return this.handleOperation(this.client.del(key), 'del');
  }

  async hset(key: string, value: { [field: string]: unknown }) {
    return this.handleOperation(this.client.hset(key, value), 'hset');
  }

  async hget(key: string, field: string) {
    return this.handleOperation(this.client.hget(key, field), 'hget');
  }

  async lpush(key: string, ...values: unknown[]) {
    return this.handleOperation(this.client.lpush(key, ...values), 'lpush');
  }

  async lrange(key: string, start: number, stop: number) {
    return this.handleOperation(this.client.lrange(key, start, stop), 'lrange');
  }

  async sadd(key: string, ...members: string[]) {
    return this.handleOperation(this.client.sadd(key, ...members), 'sadd');
  }

  async srem(key: string, ...members: string[]) {
    return this.handleOperation(this.client.srem(key, ...members), 'srem');
  }

  async sismember(key: string, member: string) {
    return this.handleOperation(
      this.client.sismember(key, member),
      'sismember',
    );
  }

  //async zadd(key: string, scoreMembers: Array<[number, string]>) {
  //  return this.handleOperation(this.client.zadd(key, scoreMembers), 'zadd'); // TODO: Problem with type
  //}

  async zrange(key: string, start: number, stop: number) {
    return this.handleOperation(this.client.zrange(key, start, stop), 'zrange');
  }

  async setbit(key: string, offset: number, value: 0 | 1) {
    return this.handleOperation(
      this.client.setbit(key, offset, value),
      'setbit',
    );
  }

  async getbit(key: string, offset: number) {
    return this.handleOperation(this.client.getbit(key, offset), 'getbit');
  }
}
