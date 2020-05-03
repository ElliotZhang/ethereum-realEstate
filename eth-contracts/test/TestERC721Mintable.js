var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            let verifier = await Verifier.new();
            this.contract = await SolnSquareVerifier.new("TestName", "TestSymbol", verifier.address, {from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, "111", { from: account_one })
            await this.contract.mint(account_two, 2, "222", { from: account_one })

        })

        it('should return total supply', async function () { 
            let result = await this.contract.totalSupply.call();
            assert.equal(result, 2, "Total supply should be 2");
        })

        it('should get token balance', async function () { 
            let result = await this.contract.balanceOf.call(account_two);
            assert.equal(result, 2, "Balance should be 2");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let result = await this.contract.tokenURI.call(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", result, "Should match token URI");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_one, 1, { from: account_two });
            let result = await this.contract.ownerOf.call(1);
            assert.equal(result, account_one, "Token should have been transfered");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            let verifier = await Verifier.new();
            this.contract = await SolnSquareVerifier.new("TestName", "TestSymbol", verifier.address, {from: account_one});

        })

        it('should fail when minting when address is not contract owner', async function () {
            let exceptionThrown = false;
            try {
                await this.contract.mint(account_two, 3, "333", { from: account_two })
            } catch (error) {
                exceptionThrown = true;
            }
            assert.equal(exceptionThrown, true, "Exception should have been thrown");
        })

        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner.call();
            assert.equal(result, account_one, "Owner should be account one");
        })

    });
})