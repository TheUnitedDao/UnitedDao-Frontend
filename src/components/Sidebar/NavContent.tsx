import { t, Trans } from "@lingui/macro";
import { Box, Divider, Link, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
//import { Environment } from "src/helpers/environment/Environment/Environment";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import { useNetwork } from "wagmi";

import OlympusIcon from "../../assets/UnitedDAOwText.png";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";

const PREFIX = "NavContent";

const classes = {
  gray: `${PREFIX}-gray`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.gray}`]: {
    color: theme.colors.gray[90],
  },
}));

const NavContent: React.VFC = () => {
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://uniteddao.global" target="_blank" rel="noopener noreferrer">
              <img src={OlympusIcon} className="logo" />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {chain.id === networks.MAINNET ? (
                <>
                  <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />

                  <NavItem to="/bonds" icon="bond" label={t`Bond`}>
                    <Bonds />
                    <InverseBonds />
                  </NavItem>

                  <NavItem to="/stake" icon="stake" label={t`Stake`} />

                  <NavItem to="/zap" icon="zap" label={t`Zap`} />

                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />

                  {/* <NavItem icon="bridge" label={t`Bridge`} to="/bridge" /> */}

                  <Box className="menu-divider">
                    <Divider />
                  </Box>

                  {/* <NavItem href="https://pro.uniteddao.global/" icon="olympus" label={t`United Pro`} />

                  <Box className="menu-divider">
                    <Divider />
                  </Box> */}
                </>
              ) : (
                <>
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />

                  {/* <NavItem icon="bridge" label={t`Bridge`} to="/bridge" /> */}
                </>
              )}

              {/* <NavItem href="https://forum.uniteddao.global/" icon="forum" label={t`Forum`} /> */}

              <NavItem href="https://vote.uniteddao.global/" icon="governance" label={t`Governance`} />

              <NavItem href="https://docs.uniteddao.global/" icon="docs" label={t`Docs`} />

              {/* <NavItem href="https://immunefi.com/bounty/olympus/" icon="bug-report" label={t`Bug Bounty`} />

              <NavItem href="https://grants.uniteddao.global/" icon="grants" label={t`Grants`} /> */}
            </div>
          </div>
        </div>

        <StyledBox display="flex" justifyContent="space-between" paddingX="50px" paddingY="24px">
          <Link href="https://github.com/UnitedDAO" target="_blank" rel="noopener noreferrer">
            <Icon name="github" className={classes.gray} />
          </Link>

          <Link href="https://olympusdao.medium.com/" target="_blank" rel="noopener noreferrer">
            <Icon name="medium" className={classes.gray} />
          </Link>

          <Link href="https://twitter.com/UnitedDAO" target="_blank" rel="noopener noreferrer">
            <Icon name="twitter" className={classes.gray} />
          </Link>

          <Link href="https://discord.gg/UnitedDAO" target="_blank" rel="noopener noreferrer">
            <Icon name="discord" className={classes.gray} />
          </Link>
        </StyledBox>
      </Box>
    </Paper>
  );
};

const Bonds: React.VFC = () => {
  const bonds = useLiveBonds().data;

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="16px" mb="12px">
      {sortByDiscount(bonds)
        .filter(bond => !bond.isSoldOut)
        .map(bond => (
          <Box mt="8px">
            <Link key={bond.id} component={NavLink} to={`/bonds/${bond.id}`}>
              <Typography variant="body1">
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  {bond.quoteToken.name}
                  <BondDiscount discount={bond.discount} />
                </Box>
              </Typography>
            </Link>
          </Box>
        ))}
    </Box>
  );
};

const InverseBonds: React.VFC = () => {
  const bonds = useLiveBonds({ isInverseBond: true }).data;

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="16px" mb="12px">
      <Typography variant="body2" color="textSecondary">
        <Trans>Inverse Bonds</Trans>
      </Typography>

      <Box mt="12px">
        {sortByDiscount(bonds)
          .filter(bond => !bond.isSoldOut)
          .map(bond => (
            <Box mt="8px">
              <Link key={bond.id} component={NavLink} to={`/bonds/inverse/${bond.id}`}>
                <Typography variant="body1">
                  <Box display="flex" flexDirection="row" justifyContent="space-between">
                    {bond.quoteToken.name}
                    <BondDiscount discount={bond.discount} />
                  </Box>
                </Typography>
              </Link>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default NavContent;
