import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import UserDepositeModel from "./UserDepositeModel";
import Spinner from "../BaseFile/comman/Spinner";
import { useSelector } from "react-redux";
import { Wallet, DollarSign } from "lucide-react";
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

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
const USDT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address, uint256) returns (bool)",
];

const BSC_CHAIN_ID = "0x38"; // BSC Mainnet Chain ID
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const BSCSCAN_API_URL = "https://api.bscscan.com/api";

export default function WalletConnection() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { chainId } = useWeb3ModalState();
  const { walletProvider } = useWeb3ModalProvider();
  const { disconnect } = useDisconnect();
  const [bnbBalance, setBnbBalance] = useState("0.00");
  const [usdtBalance, setUsdtBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { auth } = useSelector((state) => state.auth);
  const { qr } = useSelector((state) => state.qr);
  const apiKey = "23UG2IS82RDUMQK51EKN36WCZY58HSVMCE";

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

  const fetchTransactions = async (address, page = 1, offset = 10) => {
    const adminAddress = qr?.BEB20;
    if (!address || !adminAddress) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        module: "account",
        action: "tokentx",
        address: address,
        startblock: "0",
        endblock: "99999999",
        page: page.toString(),
        offset: offset.toString(),
        sort: "desc",
        apikey: apiKey,
      });

      const response = await axios.get(`${BSCSCAN_API_URL}?${params}`);

      if (response.data.status === "1" && Array.isArray(response.data.result)) {
        // Filter transactions that only involve the admin address and the specified address
        const filteredTransactions = response.data.result.filter((tx) => {
          const fromAddress = tx.from.toLowerCase();
          const toAddress = tx.to.toLowerCase();
          const userAddress = address.toLowerCase();
          const admin = adminAddress.toLowerCase();

          return (
            // Transaction is either from admin to user or from user to admin
            (fromAddress === admin && toAddress === userAddress) ||
            (fromAddress === userAddress && toAddress === admin)
          );
        });

        const formattedTransactions = filteredTransactions.map((tx) => {
          try {
            // Handle cases where tokenDecimal might be missing or invalid
            const decimals = parseInt(tx.tokenDecimal) || 18;

            // Use a try/catch for the BigInt conversion
            let formattedValue = "0.00";
            try {
              const value = ethers.getBigInt(tx.value);
              formattedValue = ethers.formatUnits(value, decimals);
              formattedValue = parseFloat(formattedValue).toFixed(2);
            } catch (valErr) {
              console.warn(`Error converting value for tx ${tx.hash}:`, valErr);
            }

            return {
              ...tx,
              formattedValue,
            };
          } catch (err) {
            console.warn(`Error formatting transaction ${tx.hash}:`, err);
            return {
              ...tx,
              formattedValue: "0.00",
            };
          }
        });

        setTransactions(formattedTransactions);
      } else {
        console.warn(
          "No transactions found or invalid response:",
          response.data
        );
        setTransactions([]);
      }
    } catch (err) {
      console.error("Transaction fetch error:", err);
      setError("Failed to fetch transaction history");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit button click
  const handleDeposit = () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsModalOpen(true);
  };

  // Clean disconnect function
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setBnbBalance("0.00");
      setUsdtBalance("0.00");
      setTransactions([]);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };
  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address, chainId]);

  // Effect for transaction updates
  useEffect(() => {
    if (address) {
      fetchTransactions(address);
    }
  }, [address, chainId]);

  const handleOpen = async () => {
    setError(""); // Clear any previous errors
    try {
      await open();
    } catch (err) {
      console.error("Error opening wallet modal:", err);
      setError("Failed to open wallet connection modal");
    }
  };

  // Effect to handle chain switching after connection
  useEffect(() => {
    if (isConnected && walletProvider) {
      switchToBNBChain().catch((err) => {
        console.error("Failed to switch chain after connection:", err);
      });
    }
  }, [isConnected, walletProvider]);

  return (
    <div className="">
      <div className="py-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!isConnected ? (
          // <button
          //   onClick={handleOpen}
          //   disabled={isLoading}
          //   className="flex w-full text-center items-center gap-2 px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200"
          // >
          //   <Wallet size={18} />
          //   {isLoading ? <Spinner /> : "Pay with Wallet"}
          // </button>

          <button
            onClick={handleOpen}
            disabled={isLoading}
            className="relative inline-flex w-full items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-sky-600 transition duration-300 ease-out border-2 border-sky-500 rounded-md  group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-sky-500 group-hover:translate-x-0 ease">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-sky-500 transition-all duration-300 transform group-hover:translate-x-full ease">
              {isLoading ? <Spinner /> : "Pay with Wallet"}
            </span>
            <span className="relative invisible">
              {isLoading ? <Spinner /> : "Pay with Wallet"}
            </span>
          </button>
        ) : (
          // <div className="mt-4">

          //  <div className="flex items-center gap-3 my-4 justify-end">
          //   <button
          //     onClick={disconnectWallet}
          //     className="px-4 py-2 text-sm font-medium bg-red-600/20 text-red-300 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
          //   >
          //     Disconnect Wallet
          //   </button>
          //   {auth && auth?.username && (
          //     <button
          //       onClick={handleDeposit}
          //       className="px-4 py-2 text-sm font-medium bg-green-600/20 text-green-300 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all duration-200"
          //     >
          //       Deposit USDT
          //     </button>
          //   )}
          // </div>
          //   {/* <div className="grid md:grid-cols-2 gap-6">
          //     <div className="bg-blue-950 rounded-lg p-4 border border-blue-800">
          //       <div className="flex items-center gap-3 mb-3">
          //         <Wallet className="text-blue-400" size={24} />
          //         <div>
          //           <p className="text-xs text-gray-400 mb-1">
          //             Connected Wallet
          //           </p>
          //           <p className="text-sm font-medium text-gray-200">
          //             {address?.slice(0, 6)}...{address?.slice(-4)}
          //           </p>
          //         </div>
          //       </div>
          //     </div>
          //     <div className="bg-blue-950/50 rounded-lg p-4 border border-blue-800/30">
          //       <div className="flex items-center gap-3 mb-3">
          //         <DollarSign className="text-green-400" size={24} />
          //         <div className="space-y-2">
          //           <div>
          //             <p className="text-xs text-gray-400">USDT Balance</p>
          //             <p className="text-lg font-semibold text-gray-200">
          //               {parseFloat(usdtBalance).toFixed(2)} USDT
          //             </p>
          //           </div>
          //           <div>
          //             <p className="text-xs text-gray-400">BNB Balance</p>
          //             <p className="text-lg font-semibold text-gray-200">
          //               {parseFloat(bnbBalance).toFixed(4)} BNB
          //             </p>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div> */}

          //   <div className="grid md:grid-cols-1 gap-4">
          //     {/* Wallet Card */}
          //     <div className="bg-blue-900 rounded-md border border-blue-800 shadow-lg p-6 flex flex-col justify-between h-full">
          //       <div className="flex items-center gap-4">
          //         <Wallet
          //           className="text-blue-400 bg-blue-800 p-2 rounded-full"
          //           size={40}
          //         />
          //         <div>
          //           <p className="text-sm text-gray-400">Connected Wallet</p>
          //           <p className="text-lg font-semibold text-white">
          //             {address?.slice(0, 6)}...{address?.slice(-4)}
          //           </p>
          //         </div>
          //       </div>
          //       <div className="mt-4 text-sm text-gray-400">
          //         Manage and track your connected wallet easily.
          //       </div>
          //     </div>

          //     {/* Balances Card */}
          //     <div className="bg-blue-900 rounded-md border border-blue-800 shadow-lg p-6 h-full flex flex-col justify-between">
          //       <div className="flex items-center gap-4 mb-4">
          //         <DollarSign
          //           className="text-green-400 bg-green-900 p-2 rounded-full"
          //           size={40}
          //         />
          //         <p className="text-lg font-semibold text-white">
          //           Your Balances
          //         </p>
          //       </div>

          //       <div className="space-y-4">
          //         <div className="flex items-center justify-between">
          //           <p className="text-sm text-gray-400">USDT Balance</p>
          //           <span className="bg-green-700/20 text-green-400 text-sm font-medium px-3 py-1 rounded-lg">
          //             {parseFloat(usdtBalance).toFixed(2)} USDT
          //           </span>
          //         </div>
          //         <div className="flex items-center justify-between">
          //           <p className="text-sm text-gray-400">BNB Balance</p>
          //           <span className="bg-yellow-600/20 text-yellow-400 text-sm font-medium px-3 py-1 rounded-lg">
          //             {parseFloat(bnbBalance).toFixed(4)} BNB
          //           </span>
          //         </div>
          //       </div>

          //       <div className="mt-4 text-sm text-gray-400">
          //         Keep track of your asset balances securely.
          //       </div>
          //     </div>
          //   </div>

          // </div>
          <div className="bg-blue-900 mt-6 rounded-md border border-blue-800 shadow-lg p-6 space-y-4">
            <p className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet className="text-blue-400" size={20} /> Account Summary
            </p>

            <ul className="divide-y divide-blue-800">
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Wallet className="text-blue-400" size={24} />
                  <span className="text-gray-300 text-sm">
                    Connected Wallet
                  </span>
                </div>
                <span className="text-sm text-white bg-blue-800/50 px-3 py-1 rounded-lg">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </li>

              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-green-400" size={24} />
                  <span className="text-gray-300 text-sm">USDT Balance</span>
                </div>
                <span className="bg-green-700/20 text-green-400 text-sm font-medium px-3 py-1 rounded-lg">
                  {parseFloat(usdtBalance).toFixed(2)} USDT
                </span>
              </li>

              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-yellow-400" size={24} />
                  <span className="text-gray-300 text-sm">BNB Balance</span>
                </div>
                <span className="bg-yellow-600/20 text-yellow-400 text-sm font-medium px-3 py-1 rounded-lg">
                  {parseFloat(bnbBalance).toFixed(4)} BNB
                </span>
              </li>
            </ul>

            <div className="flex items-center gap-3 my-4 justify-end">
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 text-sm font-medium bg-red-600/20 text-red-300 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all duration-200"
              >
                Disconnect Wallet
              </button>
              {auth && auth?.username && (
                <button
                  onClick={handleDeposit}
                  className="px-4 py-2 text-sm font-medium bg-green-600/20 text-green-300 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all duration-200"
                >
                  Deposit USDT
                </button>
              )}
            </div>
          </div>
        )}

        {/* Transactions Table - only show if there are transactions */}
        {!isLoading && transactions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-blue-950/50 border border-blue-800/30 rounded-lg overflow-hidden">
                <thead className="bg-blue-900/50 text-white text-sm">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">
                      Txn Hash
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Token</th>
                    <th className="py-3 px-4 text-left font-medium">From</th>
                    <th className="py-3 px-4 text-left font-medium">To</th>
                    <th className="py-3 px-4 text-left font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-800/30">
                  {transactions.map((tx, index) => (
                    <tr
                      key={`${tx.hash}-${index}`}
                      className="text-sm hover:bg-blue-900/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <a
                          href={`https://bscscan.com/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {tx.hash.substring(0, 10)}...
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {tx.tokenSymbol}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {tx.from.substring(0, 6)}...
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {tx.to.substring(0, 6)}...
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        ${tx.formattedValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && transactions.length === 0 && isConnected && (
          <p className="text-center text-gray-400 mt-4">
            No transactions found.
          </p>
        )}

        <UserDepositeModel
          openModel={isModalOpen}
          modelClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
