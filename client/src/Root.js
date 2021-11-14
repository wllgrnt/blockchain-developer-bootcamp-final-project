/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { Web3ContextProvider } from "./hooks/web3Context";

import App from "./App";
import store from "./store";

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Web3ContextProvider>
        <Provider store={store}>
            <App />
        </Provider>
      </Web3ContextProvider>
    );
  }
}