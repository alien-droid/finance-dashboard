import { useOpenAccount } from "@/hooks/accounts/use-open-account";

type AccountColumnProps = {
  account: string;
  accountId: string;
};

export const AccountColumn = ({ account, accountId }: AccountColumnProps) => {
  const { onOpen: openAccount } = useOpenAccount();

  const handleClick = () => {
    openAccount(accountId);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center cursor-pointer hover:underline"
    >
      {account}
    </div>
  );
};
