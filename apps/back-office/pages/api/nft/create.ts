import { createEventNftCollection } from '@features/organizer/event/server';

export default async function handler(req, res) {
  try {
    const props = req.data;
    const eventNftCollection = await createEventNftCollection({
      contractAddress: props.contractAddress,
      eventId: props.eventId,
      chainId: props.chainId,
      activityWebhookId: 'test.url', // TODO call the function to create an activityWebhook
    });
    res.status(200).json(eventNftCollection);
  } catch (e) {
    res.status(400).json(e);
  }
}
