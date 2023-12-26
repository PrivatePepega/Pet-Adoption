const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {expect} = require('chai');

describe('PetAdoption', function () {   

    async function deployContract() { 
        const PET_COUNT = 5;
        const ADOPTED_PET_INDEX = 0;
        const [owner, account2, account3] = await ethers.getSigners();
        const PetAdoption = await ethers.getContractFactory("PetAdoption");
        const contract = await PetAdoption.deploy(PET_COUNT);

        await contract.connect(account3).adoptPet(ADOPTED_PET_INDEX);

        return {
            owner, account2, account3,
            contract,
            petAddedCount: PET_COUNT,
            adoptedPetIdx: ADOPTED_PET_INDEX
        };
    }



    // describe('Deployment', function () {
    //     it('return owner', async function () {
    //         const {owner, contract, account2} = await loadFixture(deployContract);
    //         const contractOwner = await contract.owner();

    //         expect(contractOwner).to.equal(owner.address);
    //     });
    // });


    describe("Add Pet", function () {
        it("return error", async function () {
            const {owner, contract, account2} = await loadFixture(deployContract);
            await expect(contract.connect(account2).addPet()).to.be.revertedWith("Only owner can add pets");
        })
        
        it("Should return pet index", async function () {
            const {contract, petAddedCount} = await loadFixture(deployContract);
            // here we call the function
            await contract.addPet();
            expect(await contract.petIndex()).to.equal(petAddedCount + 1);
        })
    });

    describe("Adopt Pet", function () {
        it("Should return error", async function () {
          const {contract, petAddedCount} = await loadFixture(deployContract);

          await expect(contract.adoptPet(petAddedCount)).to.be.revertedWith("Pet does not exist");
          await expect(contract.adoptPet(-1)).to.be.rejectedWith("value out-of-bounds");

        });


        it("Should revert if pet is adopted", async function () {
            const {contract, adoptedPetIdx} = await loadFixture(deployContract);
  
            await expect(contract.adoptPet(adoptedPetIdx)).to.be.revertedWith("Pet already adopted");
  
          });


          it("Should adopt pet successfully", async function () {
            const {contract, account2} = await loadFixture(deployContract);
            const idx = 1;
  
            await expect(contract.connect(account2).adoptPet(idx)).not.to.be.reverted;
          });
    })


    

});