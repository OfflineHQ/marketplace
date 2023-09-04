import { createEventPassNftContract } from '@features/organizer/event/server';

export default async function handler(req, res) {
  try {
    const data = JSON.parse(req.body);
    const eventNftCollection = await createEventPassNftContract({
      contractAddress: data.props.contractAddress,
      eventPassId: data.props.id,
      chainId: data.props.chainId,
      eventId: data.props.eventId,
      organizerId: data.props.organizerId,
    });
    res.status(200).json(eventNftCollection);
  } catch (e) {
    res.status(400).json(e);
  }
}
