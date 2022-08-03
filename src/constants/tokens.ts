import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { calculateUniOrSushiLPValue } from "src/helpers/pricing/calculateUniOrSushiLPValue";
import { NetworkId } from "src/networkDetails";
import { IERC20__factory, PairContract__factory } from "src/typechain";

import {
  DAI_ADDRESSES,
  FRAX_ADDRESSES,
  GUNITED_ADDRESSES,
  LUSD_ADDRESSES,
  UNITED_ADDRESSES,
  UNITED_DAI_LP_ADDRESSES,
  SUNITED_ADDRESSES,
  UST_ADDRESSES,
  V1_UNITED_ADDRESSES,
  V1_SUNITED_ADDRESSES,
  WBTC_ADDRESSES,
  WETH_ADDRESSES,
  WSUNITED_ADDRESSES,
} from "./addresses";

export const UNITED_TOKEN = new Token({
  icons: ["UNITED"],
  name: "UNITED",
  decimals: 9,
  addresses: UNITED_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl:
    "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
});

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
UNITED_TOKEN.customPricingFunc = async () => {
  const contract = UNITED_DAI_LP_TOKEN.getEthersContract(NetworkId.MAINNET);
  const [ohm, dai] = await contract.getReserves();
  return new DecimalBigNumber(dai.div(ohm), 9);
};

export const SUNITED_TOKEN = new Token({
  icons: ["sUNITED"],
  name: "sUNITED",
  decimals: 9,
  addresses: SUNITED_ADDRESSES,
  factory: IERC20__factory,
  customPricingFunc: UNITED_TOKEN.getPrice,
  purchaseUrl:
    "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
});

export const GUNITED_TOKEN = new Token({
  icons: ["gUNITED"],
  name: "gUNITED",
  decimals: 18,
  addresses: GUNITED_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const V1_UNITED_TOKEN = new Token({
  icons: ["UNITED"],
  name: "UNITED (v1)",
  decimals: 9,
  addresses: V1_UNITED_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const V1_SUNITED_TOKEN = new Token({
  icons: ["sUNITED"],
  name: "sUNITED (v1)",
  decimals: 9,
  addresses: V1_SUNITED_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const WSUNITED_TOKEN = new Token({
  icons: ["wsUNITED"],
  name: "wsUNITED",
  decimals: 18,
  addresses: WSUNITED_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const WETH_TOKEN = new Token({
  icons: ["wETH"],
  name: "WETH",
  decimals: 18,
  addresses: WETH_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const DAI_TOKEN = new Token({
  icons: ["DAI"],
  name: "DAI",
  decimals: 18,
  addresses: DAI_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
DAI_TOKEN.customPricingFunc = async () => {
  // WHY DO WE FIX DAI to $1 in BOND PRICING?
  // because we are trying to give the user a price in USD and
  // there is no such thing as USD on chain. If we wanted to be
  // more precise we could give a price in DAI like 13.59 DAI
  // rather than $13.59
  return new DecimalBigNumber("1", 18);
};

/**
 * For inverse bonds, we have to use a different DAI testnet token
 * for compatability. Reason why has something to do with how the
 * treasury was set up on the rinkeby contract.
 */
export const TEST_DAI_TOKEN = new Token({
  icons: ["DAI"],
  name: "DAI",
  decimals: 18,
  addresses: {
    [NetworkId.MAINNET]: DAI_ADDRESSES[NetworkId.MAINNET],
    [NetworkId.TESTNET_RINKEBY]: "0xbc9ee0d911739cbc72cd094ada26f56e0c49eeae",
  },
  factory: IERC20__factory,
  purchaseUrl: "",
});

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
TEST_DAI_TOKEN.customPricingFunc = async () => {
  return new DecimalBigNumber("1", 18);
};

export const LUSD_TOKEN = new Token({
  icons: ["LUSD"],
  name: "LUSD",
  decimals: 18,
  addresses: LUSD_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const UNITED_DAI_LP_TOKEN = new Token({
  decimals: 18,
  name: "UNITED-DAI LP",
  icons: ["UNITED", "DAI"],
  factory: PairContract__factory,
  addresses: UNITED_DAI_LP_ADDRESSES,
  purchaseUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
});

UNITED_DAI_LP_TOKEN.customPricingFunc = networkId =>
  calculateUniOrSushiLPValue({ networkId, lpToken: UNITED_DAI_LP_TOKEN, poolTokens: [UNITED_TOKEN, DAI_TOKEN] });

export const UST_TOKEN = new Token({
  icons: ["UST"],
  name: "UST",
  decimals: 6,
  addresses: UST_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const FRAX_TOKEN = new Token({
  icons: ["FRAX"],
  name: "FRAX",
  decimals: 18,
  addresses: FRAX_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const WBTC_TOKEN = new Token({
  icons: ["wBTC"],
  name: "WBTC",
  decimals: 8,
  addresses: WBTC_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});
