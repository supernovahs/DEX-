const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myDexContract;
  let myContract;
  let YourContract;
  let owner;
  let addr1;
  beforeEach(async function()  {

    const YourContract = await ethers.getContractFactory("YourContract");
    myContract = await YourContract.deploy();
    await myContract.deployed();
    const DexContract = await ethers.getContractFactory("DEX");
    myDexContract = await DexContract.deploy(myContract.address);
    await myDexContract.deployed();
    [owner, addr1]= await ethers.getSigners();

  });

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });
  it("Init function success", async function () {
    await myContract.approve(myDexContract.address,ethers.utils.parseEther("5"));
    await myDexContract.init(ethers.utils.parseEther("5"),{value: ethers.utils.parseEther("5")});
    const BalloonsInDex= await  myContract.balanceOf(myDexContract.address);
    const ownerBalloonsBalance= await myContract.balanceOf(owner.address);
    const liquiditymapping= await myDexContract.liquidity(owner.address);
    expect(myDexContract.TotalLiquidity !=0);
    expect(ethers.utils.formatEther(BalloonsInDex)).to.equal("5.0");
    expect(ethers.utils.formatEther(ownerBalloonsBalance)).to.equal("995.0");
    expect(ethers.utils.formatEther(liquiditymapping)).to.equal("5.0");
  //   const DExEthBalance= await myDexContract.getEthBalance();
  //   console.log(ethers.utils.formatEther(DExEthBalance));
  });
  it("price function is correctly working",async function (){
    const price= await myDexContract.price(ethers.utils.parseEther("1"),ethers.utils.parseEther("5"),ethers.utils.parseEther("5"));
    console.log(ethers.utils.formatEther(price));
    
    

    // expect(price).to.equal("0.831248957812239453");
  });

  it("getliquidity func", async function (){
    await myContract.approve(myDexContract.address,ethers.utils.parseEther("5"));
    await myDexContract.init(ethers.utils.parseEther("5"),{value: ethers.utils.parseEther("5")});
    const liquidityfunc= await myDexContract.getLiquidity(owner.address);
    const formattedliduidityfunc= ethers.utils.formatEther(liquidityfunc);
    expect(formattedliduidityfunc).to.equal("5.0"); 
  });

  it("ethtoToken func successsfully working", async function() {
    await myContract.approve(myDexContract.address,ethers.utils.parseEther("5"));
    await myDexContract.init(ethers.utils.parseEther("5"),{value: ethers.utils.parseEther("5")});
    const tokensbought=  await myDexContract.ethToToken({value: ethers.utils.parseEther("1.0")});
    const Ethspent= ethers.BigNumber.from(tokensbought.value).toString();
    expect(Ethspent).to.equal("1000000000000000000");
    const balanceofDex= await myContract.balanceOf(myDexContract.address);
    console.log(ethers.BigNumber.from(balanceofDex).toString());
    expect(balanceofDex).to.equal("4168751042187760547");
  })


  it("tokenToEth func successfully working", async function(){
    await myContract.approve(myDexContract.address,ethers.utils.parseEther("15"));
    await myDexContract.init(ethers.utils.parseEther("10"),{value: ethers.utils.parseEther("5")});
    const ethbought = await myDexContract.tokenToEth(ethers.utils.parseEther("1"));
    
    console.log(Number(ethtransferred).toFixed(2));
    // console.log(Number(dexbal).toFixed(2));
    // expect(Number(dexbal).toFixed(2)).to.equal("0.91");

  })

  it("deposit function working correctly", async function(){
    await myContract.approve(myDexContract.address,ethers.utils.parseEther("300"));
    await myDexContract.CreateLiquidityFirstTime(ethers.utils.parseEther("100"),{value: ethers.utils.parseEther("10")});
    const deposit = await myDexContract.deposit({value: ethers.utils.parseEther("1.0")});
    const contractBal= await myDexContract.getEthBalance();
    const dexEthbal= ethers.utils.formatEther(contractBal);
    const totalliquidity= await myDexContract.TotalLiquidity();
    expect( ethers.utils.formatEther(totalliquidity)).to.equal("11.0");
    const dexTokenBal = await myContract.balanceOf(myDexContract.address);
    expect(Number(ethers.utils.formatEther(dexTokenBal)).toFixed(2)).to.equal("110.00");
    const liquidityMapping = await myDexContract.liquidity(owner.address);
    expect(ethers.utils.formatEther(liquidityMapping)).to.equal("11.0");


  })

  it("withdraw function correctly working", async function(){
    await myContract.approve(myDexContract.address,ethers.utils.parseEther("300"));
    await myDexContract.CreateLiquidityFirstTime(ethers.utils.parseEther("100"),{value: ethers.utils.parseEther("10")});
    await myContract.approve(addr1.address,ethers.utils.parseEther("50"));
    await myContract.transfer(addr1.address, ethers.utils.parseEther("49"));
    console.log(ethers.utils.formatEther(await myContract.balanceOf(addr1.address)));
    // await myDexContract.connect(addr1).deposit({value: ethers.utils.parseEther("1")});

    await expect( myDexContract.withdraw(ethers.utils.parseEther("11"))).to.be.revertedWith("not enough liquidity");

    // const liquidityMapping = await myDexContract.liquidity(addr1.address);
    // expect(ethers.utils.formatEther(liquidityMapping)).to.equal("2.0");
  })

});
  
