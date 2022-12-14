import { t } from "@lingui/macro";
import { Box, Divider, Grid, Link, Typography } from "@mui/material";
import { Icon, MetricCollection, Paper } from "@olympusdao/component-library";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useNetwork } from "wagmi";

import { CurrentIndex, GUNITEDPrice, SUNITEDPrice } from "../TreasuryDashboard/components/Metric/Metric";
import { MigrateInputArea } from "./components/MigrateInputArea/MigrateInputArea";
import { WrapBalances } from "./components/WrapBalances";
import { WrapInputArea } from "./components/WrapInputArea/WrapInputArea";
import { WrapSwitchNetwork } from "./components/WrapSwitchNetwork";

const Wrap: React.FC = () => {
  const networks = useTestableNetworks();
  const { chain = { id: 1 } } = useNetwork();
  const isMigrating = chain.id === networks.ARBITRUM || chain.id === networks.AVALANCHE;

  return (
    <div id="stake-view">
      <Paper headerText={t`Wrap / Unwrap`} topRight={<GUNITEDExternalLink />}>
        <Box mb="28px">
          <Grid>
            <MetricCollection>
              <SUNITEDPrice />
              <CurrentIndex />
              <GUNITEDPrice />
            </MetricCollection>
          </Grid>
        </Box>

        <WalletConnectedGuard message="Connect your wallet to wrap/unwrap your staked tokens">
          {isMigrating ? <MigrateInputArea /> : <WrapInputArea />}

          <WrapBalances />

          <Divider />

          <Box width="100%" p={1} sx={{ textAlign: "center" }}>
            <WrapSwitchNetwork />
          </Box>
        </WalletConnectedGuard>
      </Paper>
    </div>
  );
};

const GUNITEDExternalLink = () => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    aria-label="wsohm-wut"
    style={{ textDecoration: "none" }}
    href="https://docs.uniteddao.global/main/contracts/tokens#gohm"
  >
    <Box display="flex" alignItems="center">
      <Typography>gUNITED</Typography> <Icon style={{ marginLeft: "5px" }} name="arrow-up" />
    </Box>
  </Link>
);

export default Wrap;
