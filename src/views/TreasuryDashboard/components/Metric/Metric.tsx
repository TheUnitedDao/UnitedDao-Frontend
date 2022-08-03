import { t } from "@lingui/macro";
import { Metric } from "@olympusdao/component-library";
import { formatCurrency, formatNumber } from "src/helpers";
import { useOhmPrice } from "src/hooks/usePrices";
import {
  useCurrentIndex,
  useGOhmPrice,
  useMarketCap,
  useOhmCirculatingSupply,
  useOhmFloatingSupply,
  useUNITEDPrice,
  useTotalSupply,
  useTotalValueDeposited,
  useTreasuryLiquidBackingPerOhmFloating,
  useTreasuryMarketValue,
} from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";

type MetricProps = PropsOf<typeof Metric>;
type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps> = props => {
  const { data: marketCap } = useMarketCap();

  const _props: MetricProps = {
    ...props,
    label: t`Market Cap`,
    tooltip: t`Market capitalization is the dollar value of the outstanding UNITED tokens. It is calculated here as the price of UNITED multiplied by the circulating supply.

    Note: other sources may be inaccurate.`,
  };

  if (marketCap) _props.metric = formatCurrency(marketCap, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as UNITEDPriceFromSubgraph but uses UNITED-DAI on-chain price
 */
export const UNITEDPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();
  const _props: MetricProps = {
    ...props,
    label: "UNITED " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as UNITEDPrice but uses Subgraph price
 */
export const UNITEDPriceFromSubgraph: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useUNITEDPrice();
  const _props: MetricProps = {
    ...props,
    label: "UNITED " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses Subgraph price
 */
export const SUNITEDPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useUNITEDPrice();

  const _props: MetricProps = {
    ...props,
    label: "sUNITED " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CircSupply: React.FC<AbstractedMetricProps> = props => {
  const { data: totalSupply } = useTotalSupply();
  const { data: circSupply } = useOhmCirculatingSupply();

  const _props: MetricProps = {
    ...props,
    label: t`Circulating Supply (total)`,
    tooltip: t`Circulating supply is the quantity of outstanding UNITED not owned by the protocol (excluding UNITED in LPs).`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerUNITED: React.FC<AbstractedMetricProps> = props => {
  const { data: floatingSupply } = useOhmFloatingSupply();
  /**
   * Liquid backing per UNITED floating is used as the metric here.
   * Liquid backing does not include UNITED in protocol-owned liquidity,
   * so it makes sense to do the same for the denominator, and floating supply
   * is circulating supply - UNITED in liquidity.
   */
  const { data: liquidBackingPerOhmFloating } = useTreasuryLiquidBackingPerOhmFloating();

  // We include floating supply in the tooltip, as it is not displayed as a separate metric anywhere else
  const tooltip = t`Liquid backing is divided by floating supply of UNITED to give liquid backing per UNITED.
  
  Floating supply of UNITED is the quantity of outstanding UNITED not owned by the protocol (including UNITED in LPs): ${
    floatingSupply ? formatNumber(floatingSupply) : "Loading..."
  }
  `;

  const _props: MetricProps = {
    ...props,
    label: t`Liquid Backing per UNITED`,
    tooltip: tooltip,
  };

  if (liquidBackingPerOhmFloating) _props.metric = `${formatCurrency(liquidBackingPerOhmFloating, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CurrentIndex: React.FC<AbstractedMetricProps> = props => {
  const { data: currentIndex } = useCurrentIndex();

  const _props: MetricProps = {
    ...props,
    label: t`Current Index`,
    tooltip: t`The current index tracks the amount of sUNITED accumulated since the beginning of staking. Basically, how much sUNITED one would have if they staked and held 1 UNITED from launch.`,
  };

  if (currentIndex) _props.metric = `${formatNumber(currentIndex, 2)} sUNITED`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses Subgraph price
 */
export const GUNITEDPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: gOhmPrice } = useGOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: "gUNITED " + t`Price`,
    tooltip:
      "gUNITED = sUNITED * index" +
      "\n\n" +
      t`The price of gUNITED is equal to the price of UNITED multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps> = props => {
  const { data: totalValueDeposited } = useTotalValueDeposited();

  const _props: MetricProps = {
    ...props,
    label: t`Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const StakingAPY: React.FC<AbstractedMetricProps> = props => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const _props: MetricProps = {
    ...props,
    label: t`Annualized Rebases`,
  };

  if (rebaseRate) {
    const apy = (Math.pow(1 + rebaseRate, 365 * 3) - 1) * 100;
    const formatted = formatNumber(apy, 1);

    _props.metric = `${formatted}%`;
  } else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TreasuryBalance: React.FC<AbstractedMetricProps> = props => {
  const { data: treasuryMarketValue } = useTreasuryMarketValue();

  const _props: MetricProps = {
    ...props,
    label: t`Treasury Balance`,
  };

  if (treasuryMarketValue) _props.metric = formatCurrency(treasuryMarketValue);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};
