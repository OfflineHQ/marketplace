import { Cache } from '@next/cache';
import { getUnauthenticatedUserCookie } from '@next/next-auth/user';
import { produce } from 'immer';

import type {
  AllPassesCart,
  EventPassCart,
  EventSlugs,
} from '@features/organizer/event-types';

interface GetPassCartProps extends EventSlugs {
  eventPassId: string;
}
interface UpdatePassCartProps extends EventSlugs {
  pass: EventPassCart;
}

export class PassCache {
  private cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  async getAllPassesCart(): Promise<AllPassesCart | null> {
    const userId = getUnauthenticatedUserCookie();
    const key = `unauthenticated_user_id:${userId}-passes`;
    const passesCart = (await this.cache.get(key)) as string | null;
    return passesCart ? JSON.parse(passesCart) : null;
  }

  async setAllPassesCart(passesCart: AllPassesCart): Promise<void> {
    const userId = getUnauthenticatedUserCookie();
    const key = `unauthenticated_user_id:${userId}-passes`;
    await this.cache.set(key, JSON.stringify(passesCart));
  }

  async deleteAllPassesCart(): Promise<void> {
    const userId = getUnauthenticatedUserCookie();
    const key = `unauthenticated_user_id:${userId}-passes`;
    await this.cache.del(key);
  }

  async updatePassCart({
    organizerSlug,
    eventSlug,
    pass,
  }: UpdatePassCartProps): Promise<void> {
    let passesCart = await this.getAllPassesCart();
    if (!passesCart) {
      passesCart = {};
    }

    const newPassesCart = produce(passesCart, (draft) => {
      if (!draft[organizerSlug]) {
        draft[organizerSlug] = {};
      }
      if (!draft[organizerSlug][eventSlug]) {
        draft[organizerSlug][eventSlug] = [];
      }

      const index = draft[organizerSlug][eventSlug].findIndex(
        (p) => p.eventPassId === pass.eventPassId,
      );
      if (index !== -1) {
        draft[organizerSlug][eventSlug][index] = pass;
      } else {
        draft[organizerSlug][eventSlug].push(pass);
      }
    });

    await this.setAllPassesCart(newPassesCart);
  }

  async deletePassesCart({
    organizerSlug,
    eventSlug,
  }: EventSlugs): Promise<void> {
    const passesCart = await this.getAllPassesCart();
    if (!passesCart || !passesCart[organizerSlug]) {
      return;
    }

    const newPassesCart = produce(passesCart, (draft) => {
      delete draft[organizerSlug][eventSlug];
    });

    await this.setAllPassesCart(newPassesCart);
  }

  async deletePassCart({
    organizerSlug,
    eventSlug,
    eventPassId,
  }: GetPassCartProps): Promise<void> {
    const passesCart = await this.getAllPassesCart();
    if (
      !passesCart ||
      !passesCart[organizerSlug] ||
      !passesCart[organizerSlug][eventSlug]
    ) {
      return;
    }

    const newPassesCart = produce(passesCart, (draft) => {
      const index = draft[organizerSlug][eventSlug].findIndex(
        (p) => p.eventPassId === eventPassId,
      );
      if (index !== -1) {
        draft[organizerSlug][eventSlug].splice(index, 1);
      }
    });

    await this.setAllPassesCart(newPassesCart);
  }

  async getPassesCart({
    organizerSlug,
    eventSlug,
  }: EventSlugs): Promise<EventPassCart[] | null> {
    const passesCart = await this.getAllPassesCart();
    if (!passesCart || !passesCart[organizerSlug]) {
      return null;
    }

    return passesCart[organizerSlug][eventSlug] || null;
  }

  async getPassCart({
    organizerSlug,
    eventSlug,
    eventPassId,
  }: GetPassCartProps): Promise<EventPassCart | null> {
    const passesCart = await this.getAllPassesCart();
    if (
      !passesCart ||
      !passesCart[organizerSlug] ||
      !passesCart[organizerSlug][eventSlug]
    ) {
      return null;
    }

    const pass = passesCart[organizerSlug][eventSlug].find(
      (p) => p.eventPassId === eventPassId,
    );
    return pass || null;
  }

  // async getPassesCartTotalPrice({
  //   organizerSlug,
  //   eventSlug,
  //   passesData,
  // }: GetPassesCartTotalPriceProps): Promise<Money> {
  //   const passesCart = await this.getPassesCart({ organizerSlug, eventSlug });
  //   if (!passesCart) {
  //   }

  //   const totalPrice = passesCart.reduce((acc, passCart) => {
  //     const passData = passesData.find((pass) => pass.eventPassId === passCart.eventPassId);
  //     if (!passData) {
  //       return acc;
  //     }

  //     return acc + passData.price * passCart.quantity;
  //   }, 0);

  //   return totalPrice;
  // }

  async getPassesCartTotalPasses({
    organizerSlug,
    eventSlug,
  }: EventSlugs): Promise<number> {
    const passesCart = await this.getPassesCart({ organizerSlug, eventSlug });
    if (!passesCart) {
      return 0;
    }

    return passesCart.reduce((acc, passCart) => {
      return acc + passCart.quantity;
    }, 0);
  }
}
