import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import Spinner from "../BaseFile/comman/Spinner";
import { addDeposite } from "../redux/depositeSlice";
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

const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

export default function UserDepositeModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { qr } = useSelector((state) => state.qr);
  const { auth } = useSelector((state) => state.auth);

  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useWeb3ModalAccount();
  const { chainId } = useWeb3ModalState();
  const { walletProvider } = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [amount, setAmount] = useState("");
  const [bnbBalance, setBnbBalance] = useState("0");
  const [usdtBalance, setUsdtBalance] = useState("0");

  const handleAmountChange = (event) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };
  useEffect(() => {
    open();
  }, []);

  const switchToBNBChain = async () => {
    try {
      await walletProvider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], // BSC Mainnet
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await walletProvider?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "BNB Smart Chain",
                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com/"],
              },
            ],
          });
        } catch (addError) {
          setError("Failed to add BSC network");
        }
      } else {
        setError("Failed to switch network");
      }
    }
  };

  const fetchBalances = async () => {
    if (!address || !address) return;

    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);

      // Get BNB Balance
      const bnbBal = await ethersProvider.getBalance(address);
      setBnbBalance(ethers.formatEther(bnbBal));

      // Get USDT Balance
      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        ERC20_ABI,
        ethersProvider
      );

      const decimals = await usdtContract.decimals();
      const usdtBal = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.formatUnits(usdtBal, decimals));
    } catch (err) {
      setError("Failed to fetch balances");
    }
  };

  const handleTransfer = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      if (!qr?.BEB20) {
        setError("Invalid deposit address");
        return;
      }

      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        ERC20_ABI,
        signer
      );

      const decimals = await contract.decimals();
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      // Check user's balance
      const userBalance = await contract.balanceOf(address);
      if (userBalance < amountInWei) {
        setError("Insufficient USDT balance");
        return;
      }
      contract
      .transfer(qr.BEB20, amountInWei)
      .then(async (tx) => {
        setSuccess("Transaction submitted. Waiting for confirmation...");
        return tx.wait();
      })
      .then(async (txReceipt) => {
        try {
          if (txReceipt && txReceipt.hash) {
            console.log(amount, auth?.id, txReceipt.hash);
    
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("user_id", auth?.id);
            formData.append("hash", txReceipt.hash);
            formData.append("status", "complete");
    
            // Dispatch and unwrap the action
            await dispatch(addDeposite(formData))
              .unwrap()
              .then(() => {
                setSuccess(
                  "Transaction confirmed and deposit recorded successfully!"
                );
                window.location.reload();
              })
              .catch((dispatchError) => {
                console.error("Error adding deposit:", dispatchError);
                setSuccess(
                  "Transaction confirmed but failed to record deposit. Please contact support."
                );
              });
    
            // Fetch updated balances after successful deposit
            await fetchBalances();
          } else {
            throw new Error("Transaction receipt is missing hash");
          }
        } catch (error) {
          console.error("Error during transaction processing:", error);
          setSuccess(
            "Transaction confirmed but an error occurred while processing. Please contact support."
          );
        }
      })
      .catch((error) => {
        console.error("Error during transaction:", error);
        setSuccess("Transaction failed. Please try again.");
      });
    
      // Close modal after successful transaction
      setTimeout(() => {
        modelClose();
        setAmount("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err.message || "Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update balance when wallet address changes
  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address, chainId]);

  function handleCancel() {
    modelClose();
    disconnect();
  }
  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-900/50 border px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
            {/* <div className="p-5">
              <div className="pb-5 flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-3 text-gray-300">
                  Deposit USDT
                </h2>
                <button
                  onClick={modelClose}
                  className="group absolute top-0 right-0 flex cursor-pointer items-center justify-center mb-2 bg-gray-900 h-[50px] w-[50px]"
                >
                  <div className="space-y-2">
                    <span className="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
                    <span className="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                {!isConnected ? (
                  <div className="text-gray-200 text-center">
                    Please connect your wallet in the main page
                  </div>
                ) : (
                  <>
                    <div className="text-gray-200">
                      <p className="text-sm flex justify-between">
                        Connected <span> {address?.slice(0, 6)}...
                        {address?.slice(-4)}</span>
                      </p>
                      <p className="text-sm flex justify-between">Balance <span>{usdtBalance} USDT</span></p>
                      <p className="text-sm flex justify-between">Balance <span>{bnbBalance} BNB</span></p>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="depositAddress"
                        className="block text-sm font-medium text-gray-200"
                      >
                        Deposit Address
                      </label>
                      <div className="flex items-center justify-between space-x-2 text-white border rounded-sm p-2">
                        <p className="text-sm truncate">{qr?.BEB20}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-200"
                      >
                        Amount (USDT)
                      </label>
                      <input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="mt-1 block w-full text-sm border-gray-200 text-gray-200 rounded-md px-3 py-2 bg-blue-900 shadow-sm focus:ring-opacity-50"
                        placeholder="Enter amount..."
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}

                    {success && (
                      <div className="text-green-500 text-sm">{success}</div>
                    )}

                    <div className="grid md:grid-cols-2 gap-5">
                      <button
                        onClick={handleCancel}
                        className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleTransfer}
                        disabled={isLoading || !amount}
                        className="w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Spinner /> : "Confirm Deposit"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div> */}
            <div className="p-6 bg-gray-900 rounded-lg shadow-xl">
              <div className="pb-5 flex justify-center items-center border-b border-gray-700">
                <h2 className="text-2xl  text-center font-semibold text-white">
                  Deposit USDT
                </h2>
              </div>

              <div className="space-y-5 mt-5">
                {!isConnected ? (
                  <div className="text-gray-300 text-center text-sm bg-gray-800 p-3 rounded-md">
                    Please connect your wallet on the main page.
                  </div>
                ) : (
                  <>
                    <div className="text-gray-200 space-y-3 bg-gray-800 p-4 rounded-md">
                      <p className="text-sm flex justify-between">
                        <span className="font-medium">Connected</span>
                        <span className="text-indigo-400">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </p>
                      <p className="text-sm flex justify-between">
                        <span className="font-medium">USDT Balance</span>
                        <span>{usdtBalance} USDT</span>
                      </p>
                      <p className="text-sm flex justify-between">
                        <span className="font-medium">BNB Balance</span>
                        <span>{bnbBalance} BNB</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-300">
                        Deposit Address
                      </label>
                      <div className="flex items-center justify-between space-x-2 text-white border border-gray-600 rounded-md p-3 bg-gray-800">
                        <p className="text-sm truncate">{qr?.BEB20}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-300">
                        Amount (USDT)
                      </label>
                      <input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="block w-full text-sm border border-gray-600 text-gray-200 rounded-lg px-4 py-2 bg-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder="Enter amount..."
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm  rounded-md">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="text-green-500 text-sm text-center bg-green-900 p-2 rounded-md">
                        {success}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={handleCancel}
                        className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleTransfer}
                        disabled={isLoading || !amount}
                        className="w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Spinner /> : "Confirm Deposit"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
