'use server';

import { OffKeyState } from '../types';

interface GetGateStateForAddressProps {
  gateId: string;
  address: string;
}
export async function getGateStateForAddress({
  gateId,
  address,
}: GetGateStateForAddressProps) {
  // TODO implement
  // return __awaiter(this, void 0, void 0, function* () {
  // 		return {
  // 				status: 'locked',
  // 				gateId,
  // 				address,
  // 		};
  // });
  return OffKeyState.Locked;
}
