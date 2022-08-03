import "./NotFound.scss";

import { Trans } from "@lingui/macro";

import OlympusLogo from "../../assets/UnitedDaoNoText.svg";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://uniteddao.global" target="_blank" rel="noopener noreferrer">
          <img className="branding-header-icon" src={OlympusLogo} alt="UnitedDAO" />
        </a>

        <h4>
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}
