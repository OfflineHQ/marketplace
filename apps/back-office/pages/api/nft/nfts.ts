import { createEventPassNfts } from '@features/back-office/dashboard-api';

export default async function handler(req, res) {
  try {
    const data = JSON.parse(req.body);
    const eventPassNfts = await createEventPassNfts(data.props.hasuraMetadatas);
    res.status(200).json(eventPassNfts);
  } catch (e) {
    res.status(400).json(e);
  }
}
