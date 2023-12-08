import { resetCache } from '@test-utils/cache';
import { NextRedis } from './index';

describe('NextRedis exists', () => {
  it('should work', () => {
    expect(new NextRedis()).toBeDefined();
  });
});

describe('NextRedis with valid arguments', () => {
  let cache: NextRedis;

  beforeAll(async () => {
    cache = new NextRedis();
    await resetCache();
  });

  describe('set', () => {
    it('should set a value', async () => {
      expect(await cache.kv.set('test_key', 'test_value')).toBe('OK');
    });
  });

  describe('get', () => {
    it('should get a value', async () => {
      await cache.kv.set('test_key', 'test_value');
      expect(await cache.kv.get('test_key')).toBe('test_value');
    });
  });

  describe('del', () => {
    it('should delete a value', async () => {
      await cache.kv.set('test_key', 'test_value');
      expect(await cache.kv.del('test_key')).toBe(1);
      expect(await cache.kv.get('test_key')).toBe(null);
    });
  });

  describe('hset', () => {
    it('should set a hash value', async () => {
      expect(await cache.kv.hset('test_hash', { field: 'test_value' })).toBe(1);
    });
  });

  describe('hget', () => {
    it('should get a hash value', async () => {
      await cache.kv.hset('test_hash', { field: 'test_value' });
      expect(await cache.kv.hget('test_hash', 'field')).toBe('test_value');
    });
  });

  describe('lpush', () => {
    it('should push a value to a list', async () => {
      expect(await cache.kv.lpush('test_list', 'test_value')).toBe(1);
    });
  });

  describe('lrange', () => {
    it('should get a range of values from a list', async () => {
      expect(await cache.kv.lrange('test_list', 0, -1)).toEqual(['test_value']);
    });
  });

  describe('sadd', () => {
    it('should add a member to a set', async () => {
      expect(await cache.kv.sadd('test_set', 'test_member')).toBe(1);
    });
  });

  describe('srem', () => {
    it('should remove a member from a set', async () => {
      await cache.kv.sadd('test_set', 'test_member');
      expect(await cache.kv.srem('test_set', 'test_member')).toBe(1);
    });
  });

  describe('sismember', () => {
    it('should check if a member is in a set', async () => {
      await cache.kv.sadd('test_set', 'test_member');
      expect(await cache.kv.sismember('test_set', 'test_member')).toBe(1);
    });
  });

  describe('setbit', () => {
    it('should set a bit at a specific offset', async () => {
      expect(await cache.kv.setbit('test_key', 7, 1)).toBe(0);
    });
  });

  describe('getbit', () => {
    it('should get a bit at a specific offset', async () => {
      await cache.kv.setbit('test_key', 7, 1);
      expect(await cache.kv.getbit('test_key', 7)).toBe(1);
    });
  });

  it('Should work', async () => {
    expect(await cache.kv.set('test_key', 'test_value')).toBe('OK');
    expect(await cache.kv.get('test_key')).toBe('test_value');
    expect(await cache.kv.del('test_key')).toBe(1);
    expect(await cache.kv.get('test_key')).toBe(null);
  });
});
