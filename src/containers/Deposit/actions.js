import axios from 'axios';
import getBalances from '../../util/web3/getBalances';
import ERC20_ABI from '../../abi/erc20';
import store from '../../store';
import Config from '../../config';
import getWithdrawTransactions from '../../util/withdraw/getWithdrawTransactions';

const Tx = require('ethereumjs-tx');


export function withdraw(wallet, recipient, amountLong, coin) {
  return function action(dispatch) {
    const web3 = store.getState().web3.web3Instance;
    const { address } = store.getState().auth;
    const amount = Number(amountLong) * (10 ** 18);
    const { ethBalance, eduBalance } = store.getState().web3;
    const gasPrice = (store.getState().withdraw.gasPrice * (10 ** 9)).toString(16);
    if (coin === 'edu' && amountLong > eduBalance) {
      dispatch({
        type: 'WITHDRAW_ERROR',
        payload: {
          error: 'Not enough EDU balance!',
        },
      });
      return null;
    } else if (amountLong > ethBalance) {
      dispatch({
        type: 'WITHDRAW_ERROR',
        payload: {
          error: 'Not enough ETH balance!',
        },
      });
      return null;
    }

    web3.eth.getTransactionCount(address).then((txCount) => {
      const nonce = txCount.toString(16);
      let rawTransaction = null;
      if (coin === 'edu') {
        const contract = new web3.eth.Contract(ERC20_ABI, Config.token.contractAddress);
        rawTransaction = {
          from: address,
          nonce: `0x${nonce}`,
          gasPrice: `0x${gasPrice}`,
          gasLimit: '0x250CA',
          to: Config.token.contractAddress,
          chainId: Config.network.chainId,
          value: '0x0',
          data: contract.methods.transfer(recipient, amount).encodeABI(),
        };
      } else {
        rawTransaction = {
          from: address,
          nonce: `0x${nonce}`,
          gasPrice: `0x${gasPrice}`,
          gasLimit: 21000,
          to: recipient,
          chainId: Config.network.chainId,
          value: amount,
        };
      }
      const tx = new Tx(rawTransaction);
      const privateKey = Buffer.from(wallet.getPrivateKey(), 'hex');
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .once('transactionHash', (txHash) => {
          dispatch({
            type: 'WITHDRAW_SUCCESS',
            payload: {
              txHash,
            },
          });
          const axiosConfig = {
            headers: {
              'Auth-Signature': store.getState().auth.signedAddress,
              'Auth-Eth-Address': store.getState().auth.address.slice(2),
            },
          };
          const { bdnUrl } = Config.network;
          const transactionData = {
            transaction_type: 2,
            currency: coin,
            value: amountLong,
            sender: store.getState().auth.address,
            receiver: recipient,
            tx_hash: txHash,
          };
          axios.post(`${bdnUrl}api/v1/transactions/`, transactionData, axiosConfig).then(() => {
            dispatch(getWithdrawTransactions());
            dispatch(getBalances());
          });
        })
        .on('error', (error) => {
          dispatch({
            type: 'WITHDRAW_ERROR',
            payload: {
              error: error.message,
            },
          });
        });
    });
    return null;
  };
}

export function resetWithdrawProps() {
  return function action(dispatch) {
    dispatch({
      type: 'WITHDRAW_RESET',
    });
  };
}

export function changeGasPrice(gasPrice) {
  return function action(dispatch) {
    dispatch({
      type: 'GAS_PRICE_CHANGE',
      payload: {
        gasPrice,
      },
    });
  };
}
