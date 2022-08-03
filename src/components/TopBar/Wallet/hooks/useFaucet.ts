import { t } from "@lingui/macro";
import { ContractReceipt } from "ethers";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { DEV_FAUCET } from "src/constants/addresses";
import { useDynamicFaucetContract } from "src/hooks/useContract";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";

export const useFaucet = () => {
  const dispatch = useDispatch();
  const contract = useDynamicFaucetContract(DEV_FAUCET, true);

  return useMutation<ContractReceipt, Error, string>(
    async token_ => {
      if (!contract)
        throw new Error(t`Faucet is not supported on this network. Please switch to Goerli Testnet to use the faucet`);

      let transaction;
      if (token_ === "UNITED V1") {
        transaction = await contract.mintUNITED(0);
      } else if (token_ === "UNITED V2") {
        transaction = await contract.mintUNITED(1);
      } else if (token_ === "sUNITED V1") {
        transaction = await contract.mintSUNITED(0);
      } else if (token_ === "sUNITED V2") {
        transaction = await contract.mintSUNITED(1);
      } else if (token_ === "wsUNITED") {
        transaction = await contract.mintWSUNITED();
      } else if (token_ === "gUNITED") {
        transaction = await contract.mintGUNITED();
      } else if (token_ === "DAI") {
        transaction = await contract.mintDAI();
      } else if (token_ === "ETH") {
        transaction = await contract.mintETH("150000000000000000");
      } else {
        throw new Error(t`Invalid token`);
      }

      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async () => {
        dispatch(createInfoToast(t`Successfully requested tokens from Faucet`));
      },
    },
  );
};
