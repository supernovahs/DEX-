const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;
  let YourContract;
  let owner;
  let addr1;
  beforeEach(async function()  {
    const YourContract = await ethers.getContractFactory("YourContract");
    myContract = await YourContract.deploy();
    await myContract.deployed();
    [owner, addr1]= await ethers.getSigners();

  });

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });
  it("mint 1000 tokens with 18 decimals ", async function () {
    const decimals = await myContract.decimals();
    console.log(decimals);
    const balance = await myContract.balanceOf(owner.address);
    console.log(ethers.utils.formatEther(balance));
  });
  
  

    
        
    

});
  

  
  // Uncomment the event and emit lines in YourContract.sol to make this test pass

  /*it("Should emit a SetPurpose event ", async function () {
    const [owner] = await ethers.getSigners();

    const newPurpose = "Another Test Purpose";

    expect(await myContract.setPurpose(newPurpose)).to.
      emit(myContract, "SetPurpose").
        withArgs(owner.address, newPurpose);
  });*/