import { expect } from "chai";
import { ethers } from "hardhat";

describe("INT deploy", function(){
    let owner: any
    let user: any
    let intern: any

    beforeEach(async function(){
        [owner, user] = await ethers.getSigners()

        const INT = await ethers.getContractFactory("INT", owner)
        intern = await INT.deploy(1000)
        expect(await intern.deployed())
    })

    it("should have an owner being whitelisted", async function(){
        expect(await intern.owner()).to.eq(owner.address)

        expect(await intern.addressWhitelistStatus(owner.address)).to.eq(true)
    })

    it("should have name 'Intern token' and symbol 'INT'", async function(){
        expect(await intern.name()).to.eq("Intern token")

        expect(await intern.symbol()).to.eq("INT")
    })


    describe("Mintable", function(){
        it("can mint", async function(){
            await intern.mint(owner.address, 1000)
    
            expect(await intern.totalSupply()).to.eq(2000)
        })

        it("can mint to someone else", async function(){
            await intern.mint(user.address, 10000)
    
            expect(await intern.balanceOf(user.address)).to.eq(10000)
        })

        it("can't mint if not whitelisted", async function(){
            expect(await intern.addressWhitelistStatus(user.address))
            .to.eq(false)

            await expect(intern.connect(user).mint(user.address, 100))
            .to.be.revertedWith("you are not whitelisted!")
        })
    })


    describe("Burnable", function(){
        it("can burn", async function(){
            await intern.burn(owner.address, 500)
    
            expect(await intern.totalSupply()).to.eq(500)
        })

        it("can burn to someone else", async function(){
            await intern.mint(user.address, 500)
            expect(await intern.balanceOf(user.address)).to.eq(500)

            await intern.burn(user.address, 200)
            expect(await intern.balanceOf(user.address)).to.eq(300)
        })

        it("can't burn if not enough tokens", async function(){
            expect(await intern.balanceOf(owner.address)).to.eq(1000)

            await expect(intern.burn(owner.address, 1500))
            .to.be.revertedWith("not enough tokens!")
        })

        it("can't burn if not whitelisted", async function(){
            expect(await intern.addressWhitelistStatus(user.address))
            .to.eq(false)

            await expect(intern.connect(user).burn(owner.address, 100))
            .to.be.revertedWith("you are not whitelisted!")
        })
    })

    describe("TotalTokenStatus Event", function(){
        // it("should have mint event from constructor", async function(){
        //     await expect()
        //     .to.emit(intern, "TotalTokenStatus")
        //     .withArgs(owner.address, owner.address, 1000, true)
        // })

        it("can create minted tokens event", async function(){
            await expect(intern.mint(user.address, 5555))
            .to.emit(intern, "TotalTokenStatus")
            .withArgs(owner.address, user.address, 5555, true)
        })

        it("can create burned tokens event", async function(){
            await expect(intern.burn(owner.address, 15))
            .to.emit(intern, "TotalTokenStatus")
            .withArgs(owner.address, owner.address, 15, false)
        })
    })


    describe("Adding to whitelist", function(){
        it("can add to whitelist", async function(){
            await intern.addToWhitelist(user.address)
            
            expect(await intern.addressWhitelistStatus(user.address)).to.eq(true)
        })

        it("can't add whitelisted address", async function(){
            expect(await intern.addressWhitelistStatus(owner.address))
            .to.eq(true)

            await expect(intern.addToWhitelist(owner.address))
            .to.be.revertedWith("address is already whitelisted!")
        })

        it("can't add if not whitelised", async function(){
            expect(await intern.addressWhitelistStatus(user.address))
            .to.eq(false)

            await expect(intern.connect(user).addToWhitelist(user.address))
            .to.be.revertedWith("you are not whitelisted!")
        })
    })

    
    describe("Removing from whitelist", function(){
        it("can remove from whitelist", async function(){

            await intern.addToWhitelist(user.address)
            expect(await intern.addressWhitelistStatus(user.address)).to.eq(true)

            await intern.removeFromWhitelist(user.address)
            
            expect(await intern.addressWhitelistStatus(user.address)).to.eq(false)
        })

        // it("should burn balance of address after removing", async function(){
        //     expect(await intern.balanceOf(owner.address)).to.eq(1000)

        //     await intern.removeFromWhitelist(owner.address)

        //     expect(await intern.balanceOf(owner.address)).to.eq(0)
        // })

        it("can't revome not whitelisted address", async function(){
            expect(await intern.addressWhitelistStatus(user.address))
            .to.eq(false)

            await expect(intern.removeFromWhitelist(user.address))
            .to.be.revertedWith("address is not whitelisted yet!")
        })

        it("can't revome if not whitelised", async function(){
            expect(await intern.addressWhitelistStatus(user.address))
            .to.eq(false)

            await expect(intern.connect(user).removeFromWhitelist(owner.address))
            .to.be.revertedWith("you are not whitelisted!")
        })

        it("can't remove an owner", async function(){
            expect(await intern.addressWhitelistStatus(owner.address))
            .to.eq(true)

            await expect(intern.removeFromWhitelist(owner.address))
            .to.be.revertedWith ("owner can't be deleted!")
        })
    })


    describe("Whitelist Event", function(){
        // it("should have mint event from constructor, async function(){
        //     await expect()
        //     .to.emit(intern, "Whitelist")
        //     .withArgs(owner.address, owner.address, true)
        // })

        it("can create whitelisted address event", async function(){
            await expect(intern.addToWhitelist(user.address))
            .to.emit(intern, "Whitelist")
            .withArgs(owner.address, user.address, true)
        })

        it("can create removed address event", async function(){
            await intern.addToWhitelist(user.address)

            expect(await intern.addressWhitelistStatus(user.address))
            .to.eq(true)

            await expect(intern.removeFromWhitelist(user.address))
            .to.emit(intern, "Whitelist")
            .withArgs(owner.address, user.address, false)
        })
    })


    describe("Total Token supply", function(){
        it("should have dynamic total token supply", async function(){
            expect(await intern.totalSupply()).to.eq(1000)
            
            await intern.mint(user.address, 500)
            expect(await intern.totalSupply()).to.eq(1500)

            await intern.burn(owner.address, 800)
            expect(await intern.totalSupply()).to.eq(700)
        })
    })


    describe("Transfer", function(){
        it("can transfer tokens", async function () {
            const tx = await intern.transfer(user.address, 200);
            await expect(() => tx).to.changeTokenBalance(intern, user.address, 200);
        })

        it("should have the same total supply after transfer", async function () {
            expect(await intern.totalSupply()).to.eq(1000)

            await intern.transfer(user.address, 200)

            expect(await intern.totalSupply()).to.eq(1000)
        })

        it("can't transfer if not enough tokens", async function () {
            expect(await intern.balanceOf(owner.address)).to.eq(1000)
            
            await expect(intern.transfer(user.address, 1500))
            .to.be.revertedWith("not enough tokens!")
        })
    })
    
    describe("Transfer From", function(){
        it("can transfer from address with approval and allowance", async function(){
            await intern.approve(user.address, 100);

            const tx = await intern.connect(user).transferFrom(owner.address, user.address, 100);

            await expect(() => tx).to.changeTokenBalance(intern, user.address, 100);

            expect(await intern.allowance(owner.address, user.address)).to.equal(0); 
        })

        it("can't transfer from address without approval and allowance", async function(){
            await expect(intern.connect(user).transferFrom(owner.address, user.address, 400))
            .to.be.revertedWith("check allowance!")
        })

        it("can't transfer more tokens than it was approved", async function(){
            await intern.approve(user.address, 200);

            await expect(intern.connect(user).transferFrom(owner.address, user.address, 300))
            .to.be.revertedWith("check allowance!")
        })

        it("can't transfer if it is not enough tokens", async function(){
            expect(await intern.balanceOf(owner.address)).to.eq(1000)

            await intern.approve(user.address, 2000);

            await expect(intern.connect(user).transferFrom(owner.address, user.address, 1100))
            .to.be.revertedWith("not enough tokens!")
        })
    })

    
    describe("Transfer, Approve Events", function(){
        it("can create transfer event", async function(){
            await expect(intern.transfer(user.address, 300))
            .to.emit(intern, "Transfer")
            .withArgs(owner.address, user.address, 300)
        })

        it("can create approve event", async function(){
            await expect(intern.approve(user.address, 500))
            .to.emit(intern, "Approve")
            .withArgs(owner.address, user.address, 500)
        })
    })

})