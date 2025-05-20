import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateWithdrawal } from "../redux/withdrawalSlice";
import { ethers } from "ethers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
  projectId: "b00311bb20f1d71b977b474eac2b7dcd",
});

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
const BSC_CHAIN_ID = "0x38"; // BSC Mainnet Chain ID
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const BSCSCAN_API_URL = "https://api.bscscan.com/api";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address, uint256) returns (bool)",
];

const USDTTransfer = ({ user, id }) => {
  const dispatch = useDispatch();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useWeb3ModalAccount();
  const { chainId } = useWeb3ModalState();
  const { walletProvider } = useWeb3ModalProvider();

  const [bnbBalance, setBnbBalance] = useState("0.00");
  const [usdtBalance, setUsdtBalance] = useState("0.00");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        ERC20_ABI,
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

  const handleTransfer = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!user.amount || isNaN(user.amount))
        throw new Error("Invalid transfer amount");
      if (!user.bep20) throw new Error("Invalid recipient address");

      await switchToBNBChain();

      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        [
          "function transfer(address, uint256) returns (bool)",
          "function decimals() view returns (uint8)",
          "function balanceOf(address) view returns (uint256)",
        ],
        signer
      );

      const decimals = await usdtContract.decimals();
      const currentBalance = await usdtContract.balanceOf(address);
      const transferAmount = ethers.parseUnits(
        user.amount.toString(),
        decimals
      );

      if (currentBalance < transferAmount) {
        throw new Error("Insufficient USDT balance");
      }
      // Initiate the transfer
      const tx = await usdtContract.transfer(user.bep20, transferAmount);

      const res = await tx.wait();
      if (!res.hash) {
        throw new Error("Transaction failed: No transaction hash received.");
      }
      if (res && res.status === 1) {
        // Dispatch the update with the transaction hash
        dispatch(
          updateWithdrawal({
            id,
            status: "complete",
            amount: user?.amount + user.deduction,
            user_id: user?.id,
            txHash: tx.hash, // Sending transaction hash
          })
        )
          .then(() => {
            // Fetch balances after successful dispatch
            return fetchBalances();
          })
          .then(() => {
            setIsModalOpen(false);
          })
          .catch((dispatchError) => {
            console.error("Dispatch error:", dispatchError);
            setError("Transaction completed but updating status failed.");
          });
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err.message || "Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsModalOpen(false);
    disconnect(); // Disconnects the session
  };

  const handleModal = async () => {
    setIsModalOpen(true);
    await open();
  };
  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address, chainId]);

  // Effect to handle chain switching after connection
  useEffect(() => {
    if (isConnected && walletProvider) {
      switchToBNBChain().catch((err) => {
        console.error("Failed to switch chain after connection:", err);
      });
    }
  }, [isConnected, walletProvider]);
  return (
    <div>
   {isConnected ? (
        <button
          className="w-full bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-lg font-medium text-sm tracking-wide uppercase flex items-center justify-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>Send USDT</span>
        </button>
      ) : (
        <button
          className="w-full bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-lg font-medium text-sm tracking-wide uppercase flex items-center justify-center space-x-2"
          onClick={handleModal}
        >
          <span>Pay Now</span>
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl p-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">BNB Balance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bnbBalance} BNB
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">USDT Balance</p>
              <p className="text-2xl font-bold text-green-600">
                ${usdtBalance}
              </p>
            </div>

            <select
              className="bg-white text-black px-3 py-2 rounded-2xl font-semibold border"
              onChange={(e) =>
                e.target.value === "disconnect" && disconnectWallet()
              }
            >
              <option value="account">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </option>
              <option value="disconnect">Disconnect</option>
            </select>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="text-sm text-gray-500">Recipient Address</p>
              <p className="text-sm break-all font-medium text-black">
                {user?.bep20}
              </p>

              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-lg font-semibold text-black">
                ${Number(user?.amount).toFixed(2)} USDT
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                  onClick={disconnectWallet}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Confirm USDT Transfer"
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default USDTTransfer;
