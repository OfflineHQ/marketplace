import { alphaUserClient, betaUserClient } from '@test-utils/gql';
import {
  deleteTables,
  deleteAllTables,
  applySeeds,
  createDbClient,
  type PgClient,
} from '@test-utils/db';
import type { Locale, Stage } from '@gql/shared/types';

describe('tests for eventParameters', () => {
  let client: PgClient;
  const alphaUser = alphaUserClient();
  const betaUser = betaUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'eventPassNft',
    ]);
  });
  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  it('should return passed events with event pass NFTs for alpha user', async () => {
    const res = await alphaUser.GetPassedEventsWithEventPassNfts({
      address: alphaUser.me.address,
      currentDate: '2023-08-26 12:00:00.155813+01', // dateEnd for this event is `2023-08-25 12:00:00.155813+01`
      locale: 'en' as Locale,
      stage: 'DRAFT' as Stage,
    });
    const events = res.eventParameters;
    expect(events.length).toBeGreaterThan(0);
    events.forEach((event) => {
      expect(
        event.eventPassNftContracts[0].eventPassNfts.length
      ).toBeGreaterThan(0);
      event.eventPassNftContracts[0].eventPassNfts.forEach((nft) => {
        expect(nft.tokenId).not.toBeNull();
      });
      expect(event.organizer).not.toBeNull();
      expect(event.event).not.toBeNull();
    });
  });

  it('should return empty array if no passed events with event pass NFTs for a user', async () => {
    const res = await betaUser.GetPassedEventsWithEventPassNfts({
      address: 'fake_address',
      currentDate: '2023-08-26 12:00:00.155813+01',
      locale: 'en' as Locale,
      stage: 'DRAFT' as Stage,
    });
    const events = res.eventParameters;
    expect(events.length).toBe(0);
  });

  it('should return upcoming events with event pass NFTs for alpha user', async () => {
    const res = await alphaUser.GetUpcomingEventsWithEventPassNfts({
      address: alphaUser.me.address,
      currentDate: '2023-08-24 12:00:00.155813+01', // dateEnd for this event is `2023-08-25 12:00:00.155813+01`
      locale: 'en' as Locale,
      stage: 'DRAFT' as Stage,
    });
    const events = res.eventParameters;
    expect(events.length).toBeGreaterThan(0);
    events.forEach((event) => {
      expect(
        event.eventPassNftContracts[0].eventPassNfts.length
      ).toBeGreaterThan(0);
      event.eventPassNftContracts[0].eventPassNfts.forEach((nft) => {
        expect(nft.tokenId).toBeDefined();
      });
      expect(event.organizer).not.toBeNull();
      expect(event.event).not.toBeNull();
    });
  });

  it('should return empty array if no upcoming events with event pass NFTs for a user', async () => {
    const res = await betaUser.GetUpcomingEventsWithEventPassNfts({
      address: betaUser.me.address,
      currentDate: '2023-08-26 12:00:00.155813+01',
      locale: 'en' as Locale,
      stage: 'DRAFT' as Stage,
    });
    const events = res.eventParameters;
    expect(events.length).toBe(0);
  });
});
