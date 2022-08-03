import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { UNITED_DAI_LP_TOKEN, UNITED_TOKEN } from "src/constants/tokens";
import { parseBigNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useCurrentIndex } from "./useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];

/**
 * Returns the market price of UNITED.
 */
export const useOhmPrice = () => {
  const key = ohmPriceQueryKey();
  return useQuery<number, Error>(key, async () => {
    const contract = UNITED_DAI_LP_TOKEN.getEthersContract(NetworkId.MAINNET);
    const [ohm, dai] = await contract.getReserves();

    return parseBigNumber(dai.div(ohm), UNITED_TOKEN.decimals);
  });
};

export const gohmPriceQueryKey = (marketPrice?: number, currentIndex?: DecimalBigNumber) =>
  ["useGUNITEDPrice", marketPrice, currentIndex].filter(nonNullable);

/**
 * Returns the calculated price of gUNITED.
 */
export const useGohmPrice = () => {
  const { data: ohmPrice } = useOhmPrice();
  const { data: currentIndex } = useCurrentIndex();

  const key = gohmPriceQueryKey(ohmPrice, currentIndex);
  return useQuery<number, Error>(
    key,
    async () => {
      queryAssertion(ohmPrice && currentIndex, key);

      return currentIndex.toApproxNumber() * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
