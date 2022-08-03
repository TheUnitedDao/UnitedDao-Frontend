import "./style.scss";

import { i18n } from "@lingui/core";
import { useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import { MultifarmProvider } from "@multifarm/widget";
import {
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAccount, useConnect, useNetwork, useProvider } from "wagmi";

import Messages from "./components/Messages/Messages";
import NavDrawer from "./components/Sidebar/NavDrawer";
import Sidebar from "./components/Sidebar/Sidebar";
import StagingNotification from "./components/StagingNotification";
import TopBar from "./components/TopBar/TopBar";
import Wallet from "./components/TopBar/Wallet";
import { shouldTriggerSafetyCheck } from "./helpers";
import { getMultiFarmApiKey } from "./helpers/multifarm";
import { categoryTypesConfig, strategyTypesConfig } from "./helpers/multifarm";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import useTheme from "./hooks/useTheme";
import { chains } from "./hooks/wagmi";
import { loadAccountDetails } from "./slices/AccountSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { error, info } from "./slices/MessagesSlice";
import { AppDispatch } from "./store";
import { dark as darkTheme } from "./themes/dark.js";
import { girth as gTheme } from "./themes/girth.js";
import { light as lightTheme } from "./themes/light.js";
import { multifarmDarkTheme, multifarmLightTheme } from "./themes/multifarm";
//import { ReactComponentas  } from "./assets/"

// Dynamic Imports for code splitting
const Bond = lazy(() => import("./views/Bond"));
const TreasuryDashboard = lazy(() => import("./views/TreasuryDashboard/TreasuryDashboard"));
const NotFound = lazy(() => import("./views/404/NotFound"));
const Wrap = lazy(() => import("./views/Wrap/Wrap"));
const Zap = lazy(() => import("./views/Zap/Zap"));
const Stake = lazy(() => import("./views/Stake/Stake"));

const PREFIX = "App";

const classes = {
  drawer: `${PREFIX}-drawer`,
  content: `${PREFIX}-content`,
  contentShift: `${PREFIX}-contentShift`,
  toolbar: `${PREFIX}-toolbar`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  notification: `${PREFIX}-notification`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`& .${classes.drawer}`]: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },

  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },

  // necessary for content to be below app bar
  [`& .${classes.toolbar}`]: theme.mixins.toolbar,

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.notification}`]: {
    marginLeft: "312px",
  },
}));

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 312;
const transitionDuration = 969;

const MULTIFARM_API_KEY = getMultiFarmApiKey();

function App() {
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { address = "", isConnected, isReconnecting } = useAccount();
  const { error: errorMessage } = useConnect();

  const provider = useProvider();
  const { chain = { id: 1 } } = useNetwork();

  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const migModalClose = () => {
    setMigrationModalOpen(false);
  };

  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  async function loadDetails(whichDetails: string) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with networkID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to networkID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setnetworkID equal to 4 before testing.
    const loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && isConnected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chain.id, provider: loadProvider }));
    },
    [chain.id, address],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chain.id, provider, address }));
    },
    [chain.id, address],
  );

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on app.uniteddao.global!"));
    }
    loadDetails("app");
  }, []);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (isConnected && provider) {
      loadDetails("account");
    }
  }, [isConnected, chain.id, provider]);

  useEffect(() => {
    if (errorMessage) dispatch(error(errorMessage.message));
  }, [errorMessage]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  const themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <StyledDiv>
      <RainbowKitProvider
        chains={chains}
        theme={
          theme === "dark"
            ? rainbowDarkTheme({ accentColor: "#fff" })
            : rainbowLightTheme({ accentColor: "#E0E2E3", accentColorForeground: "#181A1D" })
        }
      >
        <ThemeProvider theme={themeMode}>
          <MultifarmProvider
            token={MULTIFARM_API_KEY}
            provider="olympus"
            lng={i18n.locale}
            themeColors={theme}
            badgePlacement="bottom"
            theme={theme === "light" ? multifarmLightTheme : multifarmDarkTheme}
            categoryTypesConfig={categoryTypesConfig}
            strategyTypesConfig={strategyTypesConfig}
          >
            <CssBaseline />
            <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
              <div className="backgroundImage" />
              <StagingNotification />
              <Messages />
              <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
              <nav className={classes.drawer}>
                {isSmallerScreen ? (
                  <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                ) : (
                  <Sidebar />
                )}
              </nav>

              <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
                <Suspense fallback={<div></div>}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/stake" />} />
                    {/* <Route
                      path="/stake"
                      element={<StakeVersionContainer setMigrationModalOpen={setMigrationModalOpen} />}
                    /> */}
                    <Route path="/tyche" element={<Navigate to="/give" />} />

                    <Route path="/wrap" element={<Wrap />} />
                    <Route path="/zap" element={<Zap />} />
                    <Route path="/bonds/*" element={<Bond />} />
                    <Route path="/dashboard/*" element={<TreasuryDashboard />} />
                    <Route path={"/stake/"} element={<Stake />} />
                    <Route path={"/info/*"} element={<Wallet open={true} component="info" />} />
                    <Route path={"/utility"} element={<Wallet open={true} component="utility" />} />
                    <Route path={"/wallet/history"} element={<Wallet open={true} component="wallet/history" />} />
                    <Route path="/wallet" element={<Wallet open={true} component="wallet" />}></Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </MultifarmProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </StyledDiv>
  );
}

export default App;
