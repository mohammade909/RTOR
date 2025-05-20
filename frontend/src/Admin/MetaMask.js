import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserDepositeModel from "../User/UserDepositeModel";

const BNB_CHAIN_ID = "0x38"; // BSC Mainnet
const METAMASK_DOWNLOAD_URL = "https://metamask.io/download/";
const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // USDT Contract on BSC
const USDT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const WalletConnection = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [installState, setInstallState] = useState("none"); // none, installing, adding_chain
  const [open, setOpen] = useState(false);
  const checkMetaMaskInstalled = () => {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  };

  const handleMetaMaskInstallation = () => {
    setInstallState("installing");
    window.open(METAMASK_DOWNLOAD_URL, "_blank");
  };

  const addBNBChain = async () => {
    try {
      setInstallState("adding_chain");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: BNB_CHAIN_ID,
            chainName: "BNB Smart Chain",
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com/"],
          },
        ],
      });
      setInstallState("none");
    } catch (err) {
      setError(err.message);
      setInstallState("none");
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!checkMetaMaskInstalled()) {
        handleMetaMaskInstallation();
        return;
      }
      if (localStorage.getItem("walletConnected")) {
        alert("Before reconnecting, please open MetaMask and LOCK your wallet.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BNB_CHAIN_ID }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await addBNBChain();
        } else {
          throw switchError;
        }
      }

      setAccount(accounts[0]);
      await updateBalance(accounts[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    setOpen(true);
  };

  const updateBalance = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      USDT_CONTRACT_ADDRESS,
      USDT_ABI,
      provider
    );
    const decimals = await contract.decimals();
    const balance = await contract.balanceOf(address);
    setBalance(ethers.formatUnits(balance, decimals));
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem("walletConnected"); // Remove stored connection
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || "");
        if (accounts[0]) {
          updateBalance(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const getButtonText = () => {
    if (isLoading) return "Connecting...";
    if (installState === "installing") return "Install MetaMask";
    if (installState === "adding_chain") return "Adding BNB Chain...";
    if (!checkMetaMaskInstalled()) return "Install MetaMask";
    return "Connect Wallet";
  };

  return (
    <div className="">
      <div className="bg-white rounded-sm">
        <div className="mb-4">
          {!account ? (
            <div>
              <button
                onClick={connectWallet}
                disabled={isLoading || installState === "adding_chain"}
                className="block px-3 py-2 rounded-sm text-sm font-semibold text-center text-white bg-[#dd6666] shadow-sm hover:bg-blue-900/50 hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {getButtonText()}
              </button>
              {installState === "installing" && (
                <div className="mt-2 text-sm text-gray-600">
                  1. Please install MetaMask from the opened tab 2. After
                  installation, refresh this page 3. Click the button again to
                  connect and add BNB Chain
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="mb-2 font-medium">Connected Address:</p>
              <p className="mb-4 text-sm break-all">{account}</p>
              <p className="mb-2 font-medium">USDT Balance:</p>
              <p className="mb-4">{balance} USDT</p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleDeposit}
                  className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Deposit
                </button>
                <button
                  onClick={disconnectWallet}
                  className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
          <UserDepositeModel openModel={open} modelClose={setOpen} />
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
