import { adminSdk } from '@gql/admin/api';
import {
  GetNftMintPasswordsForContractAvailableQueryVariables,
  UpdateNftMintPasswordMinterMutationVariables,
  UpdateNftMintPasswordTokenIdMutationVariables,
} from '@gql/admin/types';
import { NftMintPassword } from '@nft/types';

interface EvaluateNftMintPasswordProps
  extends GetNftMintPasswordsForContractAvailableQueryVariables,
    Pick<NftMintPassword, 'password'> {}

export class MintPasswordNftWrapper {
  private adminSdk: typeof adminSdk;
  constructor() {
    this.adminSdk = adminSdk;
  }
  private async getNftMintPasswords(
    props: GetNftMintPasswordsForContractAvailableQueryVariables,
  ) {
    const res =
      await this.adminSdk.GetNftMintPasswordsForContractAvailable(props);
    return res.nftMintPassword;
  }
  async evaluateNftMintPassword({
    password,
    ...props
  }: EvaluateNftMintPasswordProps) {
    const nftMintPasswords = await this.getNftMintPasswords(props);
    return nftMintPasswords.find(
      (nftMintPassword) => nftMintPassword.password === password,
    );
  }
  async assignNftMintPasswordToMinter(
    props: UpdateNftMintPasswordMinterMutationVariables,
  ) {
    return this.adminSdk.UpdateNftMintPasswordMinter(props);
  }
  async assignNftMintPasswordTokenId(
    props: UpdateNftMintPasswordTokenIdMutationVariables,
  ) {
    return this.adminSdk.UpdateNftMintPasswordTokenId(props);
  }
}
