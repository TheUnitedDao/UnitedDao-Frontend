import { t } from "@lingui/macro";

export const BondInfoText: React.VFC<{ isInverseBond: boolean }> = ({ isInverseBond }) => (
  <>
    {isInverseBond
      ? t`Important: Inverse bonds allow you to bond your UNITED for treasury assets. Vesting time is 0 and payouts are instant.`
      : t`Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim as sUNITED or gUNITED at the end of the term.`}
  </>
);
