import { createEventNftCollection } from '@features/organizer/event/server';
import { adminSdk } from '@gql/admin/api';

export default async function handler(req, res) {
  try {
    const id = req.query.id;

    const maxAmount = await adminSdk.GetEventPassesMaxAmount({
      eventPassId: id,
    });
    console.log(maxAmount.eventPassPricing[0].maxAmount);
    res.status(200).json(maxAmount.eventPassPricing[0].maxAmount);
  } catch (e) {
    res.status(400).json(e);
  }
}
