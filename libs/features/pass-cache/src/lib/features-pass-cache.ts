import type { EventPassCart } from '@features/organizer/event-types';
import { Cache } from '@next/cache';
import { getUnauthenticatedUserCookie } from '@next/next-auth/user';

export class PassCache {
  private cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  async getPassCart(): Promise<EventPassCart | null> {
    const userId = getUnauthenticatedUserCookie();
    const key = `unauthenticated_user_id:${userId}`;
    const passCart = (await this.cache.get(key)) as EventPassCart | null;
    return passCart ? passCart : null;
  }

  async setPassCart(passCart: EventPassCart): Promise<void> {
    const userId = getUnauthenticatedUserCookie();
    const key = `unauthenticated_user_id:${userId}`;
    await this.cache.set(key, JSON.stringify(passCart));
  }

  async deletePassCart(): Promise<void> {
    const userId = getUnauthenticatedUserCookie();
    const key = `unauthenticated_user_id:${userId}`;
    await this.cache.del(key);
  }
}
