import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useGohmBalance,
  useGohmTokemakBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";

export const StakeNextRebaseAmount = () => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const sohmBalances = useSohmBalance();
  const gohmBalances = useGohmBalance();
  const wsohmBalances = useWsohmBalance();
  const v1sohmBalances = useV1SohmBalance();
  const gohmTokemakBalances = useGohmTokemakBalance();

  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const sohmTokens = [sohmBalances[networks.MAINNET].data, v1sohmBalances[networks.MAINNET].data];
  const totalSohmBalance = sohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 9));

  const gohmTokens = [
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    gohmBalances[NetworkId.OPTIMISM].data,
    wsohmBalances[NetworkId.MAINNET].data,
    wsohmBalances[NetworkId.ARBITRUM].data,
    wsohmBalances[NetworkId.AVALANCHE].data,
    gohmTokemakBalances[NetworkId.MAINNET].data,
  ];
  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const props: PropsOf<typeof DataRow> = { title: t`Your Next Rebase` };

  if (rebaseRate && sohmBalances && totalGohmBalance && currentIndex) {
    const nextRewardAmount = rebaseRate * totalGohmBalance.mul(currentIndex).add(totalSohmBalance).toApproxNumber();
    props.balance = `${formatNumber(nextRewardAmount, 4)} sUNITED`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
