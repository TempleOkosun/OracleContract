import logo from './logo.svg';
import './App.css';
import {abi} from './stock_contract_abi';
import Web3 from "web3";


function App() {

  async function clickHandler(e) {
    e.preventDefault();
    // Set up web3 to work with ganache. Meta-mask should be connected to ganache as well
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    const contractAddress = '0x12a4e56189D371e3FD88a02f172e39D27CAFE766';
    const stockOrc = new web3.eth.Contract(abi, contractAddress);
    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    // Call the express server root '/' which fetches data from an external api & returns json.
    // Extract the needed data from the json.
    let result = await fetch("http://localhost:8000/");
    let symbol = Web3.utils.utf8ToHex("ABCD");
    let json = await result.json();
    let price = parseInt(json['price']);
    let volume = parseInt(json['price']);

    // Output the needed data.
    console.log(`Price: ${price} `);
    console.log(`Volume: ${volume} `);

    // Get the current value for the symbol by calling the smart contracts function
    const stockP = await stockOrc.methods.getStockPrice(symbol).call({from: accounts[0]});
    console.log('Stock Price with web3: ' + stockP); // Display it so we see what it currently is.

    // ORACLE- make changes to smart contract value by calling a set function with param
    const uploaded = await stockOrc.methods.setStock(symbol, parseInt(price), parseInt(volume)).send({from: accounts[0], gas: 300000})
    console.log(uploaded); // Output the transaction details for confirmation.

    // Call the get function again to see if the state variable actually changed after execution of the above.
    const newStockP = await stockOrc.methods.getStockPrice(symbol).call({from: accounts[0]});
    console.log('Stock Price with web3: ' + newStockP); // Confirm the old value has been updated.
  }

  return (

      <div className="value">
        <button onClick={clickHandler}> Click me! </button>
      </div>
  );
}

export default App