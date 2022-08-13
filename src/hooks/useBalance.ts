import { useQueries, UseQueryResult } from "react-query";
import { NetworkId } from "src/constants";
import {
  AddressMap,
  GUNITED_ADDRESSES,
  GUNITED_TOKEMAK_ADDRESSES,
  UNITED_ADDRESSES,
  SUNITED_ADDRESSES,
  V1_UNITED_ADDRESSES,
  V1_SUNITED_ADDRESSES,
  WSUNITED_ADDRESSES,
} from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useAccount } from "wagmi";

import { useMultipleTokenContracts } from "./useContract";

export const balanceQueryKey = (address?: string, tokenAddressMap?: AddressMap, networkId?: NetworkId) =>
  ["useBalance", address, tokenAddressMap, networkId].filter(nonNullable);

/**
 * Returns a balance.
 * @param addressMap Address map of the token you want the balance of.
 */
export const useBalance = <TAddressMap extends AddressMap = AddressMap>(tokenAddressMap: TAddressMap) => {
  const { address = "" } = useAccount();
  const contracts = useMultipleTokenContracts(tokenAddressMap);

  const networkIds = Object.keys(tokenAddressMap).map(Number);

  const results = useQueries(
    networkIds.map(networkId => ({
      queryKey: balanceQueryKey(address, tokenAddressMap, networkId),
      enabled: !!address,
      queryFn: async () => {
        const contract = contracts[networkId as NetworkId];
        console.debug("Refetching balance");
        const [balance, decimals] = await Promise.all([contract.balanceOf(address), contract.decimals()]);

        return new DecimalBigNumber(balance, decimals);
      },
    })),
  );

  return networkIds.reduce(
    (prev, networkId, index) => Object.assign(prev, { [networkId]: results[index] }),
    {} as Record<keyof typeof tokenAddressMap, UseQueryResult<DecimalBigNumber, Error>>,
  );
};

/**
 * Returns gUNITED balance in Fuse
 */

export const useOhmBalance = () => useBalance(UNITED_ADDRESSES);
export const useSohmBalance = () => useBalance(SUNITED_ADDRESSES);
export const useGohmBalance = () => useBalance(GUNITED_ADDRESSES);
export const useWsohmBalance = () => useBalance(WSUNITED_ADDRESSES);
export const useV1OhmBalance = () => useBalance(V1_UNITED_ADDRESSES);
export const useV1SohmBalance = () => useBalance(V1_SUNITED_ADDRESSES);
export const useGohmTokemakBalance = () => useBalance(GUNITED_TOKEMAK_ADDRESSES);
