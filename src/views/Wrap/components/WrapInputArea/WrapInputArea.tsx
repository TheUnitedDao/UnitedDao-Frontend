import { t, Trans } from "@lingui/macro";
import { Box, FormControl, Grid, MenuItem, Select, styled, Typography } from "@mui/material";
import { Input, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { GUNITED_ADDRESSES, SUNITED_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { useUnwrapGohm } from "./hooks/useUnwrapGohm";
import { useWrapSohm } from "./hooks/useWrapSohm";

export const WrapInputArea = () => {
  const networks = useTestableNetworks();
  const [amount, setAmount] = useState("");
  const [currentAction, setCurrentAction] = useState<"WRAP" | "UNWRAP">("WRAP");

  // Max balance stuff
  const addresses = currentAction === "WRAP" ? SUNITED_ADDRESSES : GUNITED_ADDRESSES;
  const balance = useBalance(addresses)[networks.MAINNET].data;
  const setMax = () => balance && setAmount(balance.toString());

  // Mutation stuff
  const wrapMutation = useWrapSohm();
  const unwrapMutation = useUnwrapGohm();
  const { isLoading: isMutating } = currentAction === "WRAP" ? wrapMutation : unwrapMutation;
  const handleSubmit = (event: React.FormEvent<WrapFormElement>) => {
    event.preventDefault();
    const amount = event.currentTarget.elements["amount-input"].value;
    (currentAction === "WRAP" ? wrapMutation : unwrapMutation).mutate(amount);
  };

  const StyledSelect = styled(Select)(() => ({
    "& .MuiSelect-icon": {
      marginTop: "-2px",
    },
  }));
  return (
    <Box mb={4}>
      <Box display="flex" alignItems="center">
        <Typography>{currentAction === "WRAP" ? "Wrap" : "Unwrap"} from</Typography>

        <FormControl style={{ margin: "0 10px" }} variant="standard">
          <StyledSelect
            label="Asset"
            disableUnderline
            id="asset-select-first"
            value={currentAction === "WRAP" ? "sUNITED" : "gUNITED"}
            onChange={event => setCurrentAction(event.target.value === "sUNITED" ? "WRAP" : "UNWRAP")}
          >
            <MenuItem value="sUNITED">sUNITED</MenuItem>
            <MenuItem value="gUNITED" data-testid="gohm-dropdown-select">
              gUNITED
            </MenuItem>
          </StyledSelect>
        </FormControl>

        <Typography>
          <span className="asset-select-label"> to </span>
        </Typography>

        <FormControl style={{ margin: "0 10px" }} variant="standard">
          <StyledSelect
            label="Asset"
            disableUnderline
            id="asset-select"
            value={currentAction === "WRAP" ? "gUNITED" : "sUNITED"}
            onChange={event => setCurrentAction(event.target.value === "sUNITED" ? "UNWRAP" : "WRAP")}
            data-testid="second-asset-select"
          >
            <MenuItem value="gUNITED">gUNITED</MenuItem>
            <MenuItem value="sUNITED">sUNITED</MenuItem>
          </StyledSelect>
        </FormControl>
      </Box>

      <Box my={1}>
        <TokenAllowanceGuard
          spenderAddressMap={STAKING_ADDRESSES}
          tokenAddressMap={currentAction === "WRAP" ? SUNITED_ADDRESSES : GUNITED_ADDRESSES}
          message={
            currentAction === "WRAP" ? (
              <>
                <Trans>First time wrapping</Trans> <b>sUNITED</b>?
                <br />
                <Trans>Please approve United DAO to use your</Trans> <b>sUNITED</b> <Trans>for wrapping</Trans>.
              </>
            ) : (
              <>
                <Trans>First time unwrapping</Trans> <b>gUNITED</b>?
                <br />
                <Trans>Please approve United DAO to use your</Trans> <b>gUNITED</b> <Trans>for unwrapping</Trans>.
              </>
            )
          }
        >
          <form onSubmit={handleSubmit} className="stake-tab-panel wrap-page">
            <Grid container>
              <Grid item xs={12} sm={8} style={{ paddingRight: "4px" }}>
                <Input
                  value={amount}
                  id="amount-input"
                  endString={t`Max`}
                  name="amount-input"
                  disabled={isMutating}
                  endStringOnClick={setMax}
                  onChange={event => setAmount(event.target.value)}
                  placeholder={t`Enter an amount of` + ` ${currentAction === "WRAP" ? "sUNITED" : "gUNITED"}`}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <PrimaryButton fullWidth type="submit" className="" disabled={isMutating} style={{ height: "43px" }}>
                  {currentAction === "WRAP"
                    ? isMutating
                      ? "Wrapping..."
                      : "Wrap to gUNITED"
                    : isMutating
                    ? "Unwrapping..."
                    : "Unwrap from gUNITED"}
                </PrimaryButton>
              </Grid>
            </Grid>
          </form>
        </TokenAllowanceGuard>
      </Box>
    </Box>
  );
};

interface WrapFormElement extends HTMLFormElement {
  elements: HTMLFormControlsCollection & { "amount-input": HTMLInputElement };
}
