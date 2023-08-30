import { createEventNftCollection } from '@features/organizer/event/server';
import { AlchemyWrapper } from '@indexer/alchemy/admin';

export default async function handler(req, res) {
  try {
    const wrapper = new AlchemyWrapper();
    const data = JSON.parse(req.body);
    const eventNftCollection = await createEventNftCollection({
      contractAddress: data.props.contractAddress,
      eventId: data.props.id,
      chainId: data.props.chainId,
      activityWebhookId: 'test.url', // TODO call the function to create an activityWebhook
    });
    res.status(200).json(eventNftCollection);
  } catch (e) {
    res.status(400).json(e);
  }
}
