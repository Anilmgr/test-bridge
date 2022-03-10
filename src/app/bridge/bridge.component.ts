import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
declare const window:any;
const chainAddress = '0x1'
const rpcurl = 'wss://mainnet.infura.io/ws/v3/0c4614c66b244dc9a975984b0cf0934a'
const remoteweb3 = new Web3(rpcurl)
const ContractAddress = '0xa63631838D45D7CBF6665299206B498Cf56b95C6'
const amountMultiply = 120000000000000000

const TokenAbis = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numberOfTokens',
        type: 'uint256',
      },
    ],
    name: 'mintRogueOutcasts',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.scss']
})
export class BridgeComponent implements OnInit {

  public inputValue: number = 1
  public i: number = 1
  public isConnected = false
  public walletAddress = ''
  public isNetworkError = false
  public totalMinted: any = 0
  public isWallectConnect = false
  cryptoAlien = new remoteweb3.eth.Contract(
    [
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'numberOfTokens',
            type: 'uint256',
          },
        ],
        name: 'mintRogueOutcasts',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    ContractAddress,
  ).methods

  constructor(){
  }

  ngOnInit(): void {
  }

  loadContract() {
    return new window.web3.eth.Contract(TokenAbis, ContractAddress)
  }

  async fetchTotalTokenMinted() {
    this.cryptoAlien
      .totalSupply()
      .call()
      .then((response: any) => {
        this.totalMinted = response
      })
  }

  checkWalletConnected() {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      return true;
    }
    return false;
  }

  async connectToMetaMask() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' }).then(
        (response: any) => {
          this.getChainId(response)
        },
        (error: any) => {
          this.isConnected = false
        },
      )
    } else {
      return
    }
  }

  async checkIfConnected(){
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    if(accounts.length > 0){
        this.isConnected = true;
    } else {
      this.isConnected = false;
    }
  }

  async getChainId(userAddresses: any) {
    window.ethereum.request({ method: 'eth_chainId' }).then((response: any) => {
      if (response === chainAddress) {
        this.setWalletAddress()
        this.isNetworkError = false
        this.isConnected = userAddresses.length == 0 ? false : true
      } else if (userAddresses.length > 0) {
        this.isConnected = userAddresses.length == 0 ? false : true
        this.isNetworkError = true
      }
    })
  }

  setWalletAddress() {
    let responseString = window.web3.currentProvider.selectedAddress
    let splittedAddress =
      responseString.substring(0, 7) +
      '...' +
      responseString.substring(responseString.length - 3)
    this.walletAddress = splittedAddress
    console.log(this.walletAddress)
  }

  async mint() {
    const contract = await this.loadContract()
    const methods = await contract.methods
    await methods
      .mintRogueOutcasts(Number(this.inputValue))
      .send({
        from: window.web3.currentProvider.selectedAddress,
        value: Number(this.inputValue) * amountMultiply,
      })
      .on('transactionHash', (response: any) => {
        const link = `https://etherscan.io/tx/${response}`;
        console.log(link);
      }
      );
    }


}
