import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useWeb3ModalState,
  useDisconnect,
} from "@web3modal/ethers/react";

// Configure Web3Modal
createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata: {
      name: "USDT Transfer App",
      description: "Transfer USDT across different networks",
    },
  }),
  chains: [
    {
      chainId: 56,
      name: "BNB Smart Chain",
      currency: "BNB",
      explorerUrl: "https://bscscan.com",
      rpcUrl: "https://bsc-dataseed.binance.org",
    },
  ],
  projectId: "b00311bb20f1d71b977b474eac2b7dcd", // Get this from cloud.walletconnect.com
});

const BSC_CHAIN_ID = "0x38"; // BSC Mainnet Chain ID
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const BSCSCAN_API_URL = "https://api.bscscan.com/api";

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
const USDT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address, uint256) returns (bool)",
];

export default function Connect() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { chainId } = useWeb3ModalState();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();

  const [bnbBalance, setBnbBalance] = useState("0.00");
  const [usdtBalance, setUsdtBalance] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Improved network switching function
  const switchToBNBChain = async () => {
    if (!walletProvider) {
      console.warn("Provider not initialized");
      setError("Wallet provider not available. Please connect again.");
      return;
    }

    try {
      if (walletProvider.provider) {
        // For Web3Modal v3
        const ethersProvider = new ethers.BrowserProvider(
          walletProvider.provider
        );
        await ethersProvider.send("wallet_switchEthereumChain", [
          { chainId: BSC_CHAIN_ID },
        ]);
      } else {
        // Legacy approach
        await walletProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_CHAIN_ID }],
        });
      }
    } catch (err) {
      // Check if this is because the chain hasn't been added
      if (err.code === 4902) {
        try {
          const params = [
            {
              chainId: BSC_CHAIN_ID,
              chainName: "BNB Smart Chain",
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: [BSC_RPC_URL],
              blockExplorerUrls: ["https://bscscan.com/"],
            },
          ];

          if (walletProvider.provider) {
            // For Web3Modal v3
            const ethersProvider = new ethers.BrowserProvider(
              walletProvider.provider
            );
            await ethersProvider.send("wallet_addEthereumChain", params);
          } else {
            // Legacy approach
            await walletProvider.request({
              method: "wallet_addEthereumChain",
              params,
            });
          }
        } catch (addError) {
          console.error("Failed to add BSC network:", addError);
          setError("Failed to add BSC network to your wallet");
        }
      } else {
        console.error("Failed to switch network:", err);
        setError("Failed to switch to BSC network");
      }
    }
  };

  // Enhanced balance fetching with proper error handling
  const fetchBalances = async () => {
    if (!address || !walletProvider) {
      console.warn("Account or provider not available");
      return;
    }

    try {
      // Create a provider that works with any web3 wallet
      let ethersProvider;

      if (walletProvider.provider) {
        ethersProvider = new ethers.BrowserProvider(walletProvider.provider);
      } else {
        // For most web3 wallets
        ethersProvider = new ethers.BrowserProvider(walletProvider);
      }

      // Fetch BNB balance
      const bnbBal = await ethersProvider.getBalance(address);
      setBnbBalance(ethers.formatEther(bnbBal));

      // Check if USDT contract exists at the address
      const code = await ethersProvider.getCode(USDT_ADDRESS);
      if (code === "0x") {
        console.warn("No contract found at USDT address");
        setUsdtBalance("0");
        return;
      }

      // Fetch USDT balance with safe fallbacks
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        USDT_ABI,
        ethersProvider
      );

      // Get decimals with fallback
      let decimals = 18;
      try {
        decimals = await usdtContract.decimals();
      } catch (decimalErr) {
        console.warn("Failed to get decimals, using default:", decimalErr);
      }

      // Get balance with fallback
      let usdtBal = ethers.parseUnits("0", decimals);
      try {
        usdtBal = await usdtContract.balanceOf(address);
      } catch (balErr) {
        console.warn("Failed to get USDT balance:", balErr);
      }

      setUsdtBalance(ethers.formatUnits(usdtBal, decimals));
    } catch (err) {
      console.error("Balance fetch error:", err);
      setError(`Failed to fetch wallet balances: ${err.message}`);
    }
  };

  // Function to fetch BNB and USDT balances

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address, chainId]);

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setBnbBalance("0.00");
      setUsdtBalance("0.00");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  return (
    <div className="w-full ">
      <div className="backdrop-blur-md bg-gray-900/50 rounded-sm sm:px-8  px-4 shadow-2xl overflow-hidden">
        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <div className="backdrop-blur-sm bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <p className="text-sm text-yellow-100/80">BNB Balance</p>
              <p className="text-lg font-semibold text-yellow-400 break-all">
                {bnbBalance} BNB
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <p className="text-sm text-green-100/80">USDT Balance</p>
              <p className="text-lg font-semibold break-all text-green-400">
                ${usdtBalance}
              </p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20 flex flex-col justify-between">
              <div className="font-semibold text-base break-all text-white/90 text-center">
                {address}
              </div>
              <button
                className="bg-red-500/80 hover:bg-red-600/80 text-white px-4 py-2 rounded-lg transition-colors duration-200 mt-2 text-sm"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className=" py-2 flex justify-end">
            <button
              className="backdrop-blur-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-6 py-3 rounded-xl transition-all duration-200 font-medium border border-blue-500/20 hover:border-blue-400/30 shadow-lg hover:shadow-blue-500/10"
              onClick={() => open()}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
