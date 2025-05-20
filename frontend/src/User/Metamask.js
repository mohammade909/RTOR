import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Metamask = () => {
    const [account, setAccount] = useState(null);
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [txHash, setTxHash] = useState('');
    const [chainName, setChainName] = useState('');
    const [balance, setBalance] = useState('');
    const [selectedChain, setSelectedChain] = useState('');

    const supportedChains = [
        { name: 'Ethereum Mainnet', chainId: '0x1' },
        { name: 'Ropsten Testnet', chainId: '0x3' },
        { name: 'Rinkeby Testnet', chainId: '0x4' },
        { name: 'Goerli Testnet', chainId: '0x5' },
        { name: 'Kovan Testnet', chainId: '0x2a' },
        { name: 'Binance Smart Chain Mainnet', chainId: '0x38' },
        { name: 'Polygon Mainnet', chainId: '0x89' },
        { name: 'Avalanche Mainnet', chainId: '0xa86a' },
    ];

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                await updateChainInfo();
            } catch (error) {
                console.error('User denied account access', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setChainName('');
        setBalance('');
        setSelectedChain('');
    };

    const updateChainInfo = async () => {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chain = supportedChains.find((c) => c.chainId === chainId);
            if (chain) {
                setChainName(chain.name);
                setSelectedChain(chain.chainId);
            } else {
                setChainName('Unknown');
                setSelectedChain('');
            }

            if (account) getBalance(account);
        } catch (error) {
            console.error('Failed to get chain ID', error);
        }
    };

    const switchChain = async (chainId) => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
            await updateChainInfo();
        } catch (error) {
            console.error('Failed to switch chain', error);
        }
    };

    const getBalance = async (account) => {
        if (!account) return;
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(account);
            setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error('Failed to get balance', error);
        }
    };

    const sendTransaction = async () => {
        if (!account || !amount || !recipient) return alert('Please fill in all fields.');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount),
            });

            setTxHash(tx.hash);
            console.log('Transaction sent:', tx);
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', updateChainInfo);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', updateChainInfo);
            }
        };
    }, [account]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
            <button
                onClick={connectWallet}
                className={`w-full px-4 py-2 mb-4 rounded-lg text-white ${account ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
            >
                {account ? `Connected: ${account}` : 'Connect MetaMask'}
            </button>

            {account && (
                <>
                    <button
                        onClick={disconnectWallet}
                        className="w-full px-4 py-2 mb-4 rounded-lg text-white bg-red-600 hover:bg-red-700 transition duration-200"
                    >
                        Disconnect
                    </button>

                    <div className="space-y-4">
                        <p className="text-lg font-semibold">Account: <span className="font-normal">{account}</span></p>
                        <p className="text-lg font-semibold">Chain: <span className="font-normal">{chainName}</span></p>
                        <p className="text-lg font-semibold">Balance: <span className="font-normal">{balance} ETH</span></p>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Select a Chain</label>
                            <select
                                value={selectedChain}
                                onChange={(e) => switchChain(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            >
                                <option value="" disabled>Select a Chain</option>
                                {supportedChains.map((chain) => (
                                    <option key={chain.chainId} value={chain.chainId}>
                                        {chain.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Recipient Address</label>
                            <input
                                type="text"
                                placeholder={`Recipient Address (${chainName})`}
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Amount in {chainName}</label>
                            <input
                                type="text"
                                placeholder={`Amount in ${chainName}`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            />
                        </div>

                        <button
                            onClick={sendTransaction}
                            className="w-full px-4 py-2 mt-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                        >
                            {`Send ${chainName}`}
                        </button>

                        {txHash && (
                            <p className="mt-4 text-green-600 font-semibold">
                                Transaction Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash}</a>
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    </div>
    );
};

export default Metamask;
