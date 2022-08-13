import { t } from "@lingui/macro";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { DataRow } from "@olympusdao/component-library";
import { NetworkId } from "src/constants";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

const DECIMAL_PLACES_SHOWN = 4;

const hasVisibleBalance = (balance?: DecimalBigNumber) =>
  balance && balance.toApproxNumber() > 9 / Math.pow(10, DECIMAL_PLACES_SHOWN + 1);

const formatBalance = (balance?: DecimalBigNumber) =>
  balance?.toString({ decimals: DECIMAL_PLACES_SHOWN, trim: false, format: true });

export const StakeBalances = () => {
  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const gohmBalances = useGohmBalance();
  const wsohmBalances = useWsohmBalance();

  const ohmBalance = useOhmBalance()[networks.MAINNET].data;
  const sohmBalance = useSohmBalance()[networks.MAINNET].data;
  const v1sohmBalance = useV1SohmBalance()[networks.MAINNET].data;
  const gohmTokemakBalance = useGohmTokemakBalance()[NetworkId.MAINNET].data;

  const sohmTokens = [sohmBalance, v1sohmBalance];

  const gohmTokens = [
    gohmTokemakBalance,
    gohmBalances[networks.MAINNET].data,
    gohmBalances[networks.ARBITRUM].data,
    gohmBalances[networks.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    wsohmBalances[networks.MAINNET].data,
    wsohmBalances[networks.ARBITRUM].data,
    wsohmBalances[networks.AVALANCHE].data,
    gohmBalances[NetworkId.OPTIMISM].data,
  ];

  const totalSohmBalance = sohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 9));

  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));

  const totalStakedBalance = currentIndex && formatBalance(totalGohmBalance.mul(currentIndex).add(totalSohmBalance));

  const allBalancesLoaded = sohmTokens.every(Boolean) && gohmTokens.every(Boolean);

  return (
    <>
      <DataRow
        id="user-balance"
        title={t`Unstaked Balance`}
        isLoading={!ohmBalance}
        balance={`${formatBalance(ohmBalance)} UNITED`}
      />

      <Accordion className="stake-accordion" square defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
          <DataRow
            id="user-staked-balance"
            isLoading={!allBalancesLoaded}
            title={t`Total Staked Balance`}
            balance={`${totalStakedBalance} sUNITED`}
          />
        </AccordionSummary>

        <AccordionDetails>
          <DataRow
            indented
            title={t`sUNITED`}
            id="sohm-balance"
            isLoading={!sohmBalance}
            balance={`${formatBalance(sohmBalance)} sUNITED`}
          />

          <DataRow
            indented
            title={t`gUNITED`}
            isLoading={!gohmBalances[networks.MAINNET].data}
            balance={`${formatBalance(gohmBalances[networks.MAINNET].data)} gUNITED`}
          />

          {hasVisibleBalance(gohmBalances[NetworkId.ARBITRUM].data) && (
            <DataRow
              indented
              title={t`gUNITED (Arbitrum)`}
              isLoading={!gohmBalances[NetworkId.ARBITRUM].data}
              balance={`${formatBalance(gohmBalances[NetworkId.ARBITRUM].data)} gUNITED`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.AVALANCHE].data) && (
            <DataRow
              indented
              title={t`gUNITED (Avalanche)`}
              isLoading={!gohmBalances[NetworkId.AVALANCHE].data}
              balance={`${formatBalance(gohmBalances[NetworkId.AVALANCHE].data)} gUNITED`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.POLYGON].data) && (
            <DataRow
              indented
              title={t`gUNITED (Polygon)`}
              isLoading={!gohmBalances[NetworkId.POLYGON].data}
              balance={`${formatBalance(gohmBalances[NetworkId.POLYGON].data)} gUNITED`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.FANTOM].data) && (
            <DataRow
              indented
              title={t`gUNITED (Fantom)`}
              isLoading={!gohmBalances[NetworkId.FANTOM].data}
              balance={`${formatBalance(gohmBalances[NetworkId.FANTOM].data)} gUNITED`}
            />
          )}

          {hasVisibleBalance(gohmBalances[NetworkId.OPTIMISM].data) && (
            <DataRow
              indented
              title={t`gUNITED (Optimism)`}
              isLoading={!gohmBalances[NetworkId.OPTIMISM].data}
              balance={`${formatBalance(gohmBalances[NetworkId.OPTIMISM].data)} gUNITED`}
            />
          )}

          {hasVisibleBalance(gohmTokemakBalance) && (
            <DataRow
              indented
              title={t`gUNITED (Tokemak)`}
              isLoading={!gohmTokemakBalance}
              balance={`${formatBalance(gohmTokemakBalance)} gUNITED`}
            />
          )}

          {hasVisibleBalance(v1sohmBalance) && (
            <DataRow
              indented
              title={t`sUNITED (v1)`}
              isLoading={!v1sohmBalance}
              balance={`${formatBalance(v1sohmBalance)} sUNITED`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[networks.MAINNET].data) && (
            <DataRow
              indented
              title={t`wsUNITED`}
              isLoading={!wsohmBalances[networks.MAINNET].data}
              balance={`${formatBalance(wsohmBalances[networks.MAINNET].data)} wsUNITED`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[NetworkId.ARBITRUM].data) && (
            <DataRow
              indented
              title={t`wsUNITED (Arbitrum)`}
              isLoading={!wsohmBalances[NetworkId.ARBITRUM].data}
              balance={`${formatBalance(wsohmBalances[NetworkId.ARBITRUM].data)} wsUNITED`}
            />
          )}

          {hasVisibleBalance(wsohmBalances[NetworkId.AVALANCHE].data) && (
            <DataRow
              indented
              title={t`wsUNITED (Avalanche)`}
              isLoading={!wsohmBalances[NetworkId.AVALANCHE].data}
              balance={`${formatBalance(wsohmBalances[NetworkId.AVALANCHE].data)} wsUNITED`}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};
