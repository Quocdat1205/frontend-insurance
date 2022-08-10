import { useContext, createContext } from "react";
export const Web3WalletContext = createContext<any>(null);

const useWeb3Wallet = () => {
  const context = useContext(Web3WalletContext);

  // if (!context) {
  //   throw new Error("useWeb3Wallet must be used within a Web3WalletProvider");
  // }

  return context;
};

export default useWeb3Wallet;
