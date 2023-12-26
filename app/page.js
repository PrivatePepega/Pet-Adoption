"use client"

import { useState, useEffect, use } from "react";
import Navbar from "./Components/Navbar";
import PetItem from "./Components/PetItem";
import TxError from "./Components/TxError";
import WalletNotDetected from "./Components/WalletNotDetected";
import ConnectToWallet from "./Components/ConnectToWallet";

import { ethers } from "ethers";
import {contractAddress} from "./address";
import PetAdoptionArtifact from "./contracts/PetAdoption.json";
import TxInfo from "./Components/TxInfo";




export default function Home() {


  const HardHatNetworkId= 31337;
  const [pets, setPets] = useState([]);
  const [ownedPets, setOwnedPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [contract, setContract] = useState(undefined);
  const [txError, setTxError] = useState(undefined);
  const [txInfo, setTxInfo] = useState(undefined);
  const [view, setView] = useState("home");

  useEffect(() => { 
    async function fetchPets() {
      const res = await fetch("/pets.json");
      const data = await res.json();
      setPets(data);
    }
    fetchPets();
  }, []);



  async function connectWallet(){
    try{
      if(typeof window !== 'undefined') {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});

        await checkNetwork();
        initializeDapp(accounts[0]);

        window.ethereum.on("accountsChanged", ([newAddress]) => {
          if (newAddress === undefined) {
            setAdoptedPets([]);
            setSelectedAddress(undefined);
            setContract(undefined);
            setTxError(undefined);
            setTxInfo(undefined);
            setView("home");
            setOwnedPets([]);
            return;
          }

          initializeDapp(newAddress);
        });
      }
    }catch(e){
      console.error(e.message);
    }
  }



  async function initializeDapp(address) {  
    setSelectedAddress(address);
    const contract = await initContract();
    getAdoptedPets(contract);  
  }


// here we are getting the provider for metamask
// in the contract we need to pass 3 things,
// the smart contract address, the abi and the provider
  async function initContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(0);
    const contract = new ethers.Contract(
      contractAddress.PetAdoption,
      PetAdoptionArtifact.abi,
      await provider.getSigner(0)
    );
    setContract(contract);
    return contract;
  }



  async function getAdoptedPets(contract){
    try{
      const adoptedPets = await contract.getAllAdoptedPets();
      const ownedPets = await contract.getAllAdoptedPetsByOwner();

      if(adoptedPets.length > 0) {
        setAdoptedPets(adoptedPets.map(Number));
      }else {
        setAdoptedPets([]);
      }

      if(ownedPets.length > 0) {
        setOwnedPets(ownedPets.map(Number));
      }else {
        setOwnedPets([]);
      }
    }catch(e){
      console.error(e.message);
    }
  }


  async function adoptPet(id){
    try {
      const tx = await contract.adoptPet(id);
      setTxInfo(tx.hash);
      const receipt = await tx.wait();
      console.log(receipt)
      console.log(contract.adoptPet(id))

      await new Promise((res) => setTimeout(res, 10000));

      if(receipt.status === 0){
        throw new Error("Transaction failed");
      }

      alert(`Pet with id: ${id} has been adopted`);
      setAdoptedPets([...adoptedPets, id]);
      setOwnedPets([...ownedPets, id]);
    }catch(e){
      console.error(e.reason);
      setTxError(e?.reason);
    } finally {
      setTxInfo(undefined);
    }
  }


  async function switchNetwork(){
    const chainIdHex = `0x${HardHatNetworkId.toString(16)}`;

    return await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  }



  async function checkNetwork(){
    // we are suppose to import the network number through the .env file but we cant because this is the /app file
    // we are suppose to bring networks trough SSR using .process.env.VAR_NAME
    if(typeof window !== 'undefined' && window.ethereum.networkVersion !== HardHatNetworkId.toString()){
      return switchNetwork();
    } else {
      return null;
    }  
  }



  if(typeof window !== 'undefined' && !window.ethereum) {
    return <WalletNotDetected />;
  }
  if(!selectedAddress){
    return <ConnectToWallet connect={connectWallet}/>;
  }



  
  return (
    <div className="container">
      {
        txInfo &&
        <TxInfo message={txInfo} />
      }
      {txError &&
        <TxError message={txError} 
          dismiss={() => setTxError(undefined)}
        />
      }
      <br />
      <Navbar
      setView={setView}
      address={selectedAddress}
      />
      <div className="items">
      {
        view ==="home" ?
        pets.map((pet) => (
          <PetItem key={pet.id}
          pet={pet}
          adoptPet={()=> adoptPet(pet.id)}
          disabled={adoptedPets.includes(pet.id)}
          inProgress={!!txInfo}
          />))
          :
          pets.filter(pet => ownedPets.includes(pet.id))
          .map((pet) => (
          <PetItem key={pet.id}
          pet={pet}
          disabled={true}
          />))

      }

      </div>
    </div>
  )
}



// polygon_mumbai
// Deployment started!
// Deploying contracts with the account:  0x391cE62f80027Af707bDf3a33Bd47E448EACec5d
// PetAdoption deployed to 0x0B8e6B33cDb8E11b08A8E58E1B407a3d021638B5