import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  window.Buffer = window.Buffer || require("buffer").Buffer;
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))


  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  window.contract = await new Contract(
      window.walletConnection.account(),
      nearConfig.contractName,
      {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: [
          "get_stream",
          "get_account",
          "get_account_incoming_streams",
          "get_account_outgoing_streams",
        ],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: [
          "start_stream",
          "pause_stream",
          "stop_stream",
          "withdraw",
        ],
      }
  );

  window.ftContract = await new Contract(
      window.walletConnection.account(),
      "wrap.testnet",
      {
        viewMethods: ["ft_balance_of"],
        changeMethods: ["ft_transfer_call", "near_deposit"],
      }
  );

  window.payOnUseContract = await new Contract(
      window.walletConnection.account(),
      "pay-on-use.testnet",
      {
        viewMethods: [],
        changeMethods: ["deposit", "pause_stream"],
      }
  );

  // // Initializing our contract APIs by contract name and configuration
  // window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
  //   // View methods are read only. They don't modify the state, but usually return some value.
  //   viewMethods: [],
  //   // Change methods can modify the state. But you don't receive the returned value when called.
  //   changeMethods: [],
  // })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  // window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn("pay-on-use.testnet")
}
