// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Test verification with correct proof', function () {
        beforeEach(async function () {
            let verifier = await Verifier.new();
            this.contract = await SolnSquareVerifier.new("TestName", "TestSymbol", verifier.address, {from: account_one});
        })

        it('should add solution', async function () { 
            await this.contract.addSolution(
                ["0x11ceea6848d6f4bb17fbe01e2f37a7f50aa5ea4da8aa6e4e364c3202dbb35deb", "0x04991e94bc0ae3718a464aecd3c351cadb9c779d8acf9601ac87245b7a5cec76"],
                [["0x18b754e9665ee861740aa1ccb4def4ed4eb945d0f26be1dced2656004ea59111", "0x099a674ea974d7421b96a617635ac38939775ce47916487edaf5d384ddd401bf"], ["0x22450d6b21830786c87e94131fbaaf9f6eaa93e6d526a827b42b706bee7654ff", "0x022b35cca41f73cee44819184e9c0054e1553f3a31310e53581d90e526c93073"]],
                ["0x07405e6618cd88e94e44ceeade27f44d9dc362cf8f4de882b0d8905906d3daea", "0x1c8e8f412dfab3243f232fa9da9b1705bf99b05952819160d69c64ede0794fab"],
                ["0x0000000000000000000000000000000000000000000000000000000000000004", "0x0000000000000000000000000000000000000000000000000000000000000001"],
                "111", { from: account_one });
            let result = await this.contract.solutions(0);
            assert.equal(result.addr, account_one, "Address should match");
            assert.equal(result.used, false, "Used should false");
        })

        it('should mint after adding solution', async function () { 
            await this.contract.addSolution(
                ["0x11ceea6848d6f4bb17fbe01e2f37a7f50aa5ea4da8aa6e4e364c3202dbb35deb", "0x04991e94bc0ae3718a464aecd3c351cadb9c779d8acf9601ac87245b7a5cec76"],
                [["0x18b754e9665ee861740aa1ccb4def4ed4eb945d0f26be1dced2656004ea59111", "0x099a674ea974d7421b96a617635ac38939775ce47916487edaf5d384ddd401bf"], ["0x22450d6b21830786c87e94131fbaaf9f6eaa93e6d526a827b42b706bee7654ff", "0x022b35cca41f73cee44819184e9c0054e1553f3a31310e53581d90e526c93073"]],
                ["0x07405e6618cd88e94e44ceeade27f44d9dc362cf8f4de882b0d8905906d3daea", "0x1c8e8f412dfab3243f232fa9da9b1705bf99b05952819160d69c64ede0794fab"],
                ["0x0000000000000000000000000000000000000000000000000000000000000004", "0x0000000000000000000000000000000000000000000000000000000000000001"],
                "222", { from: account_two });

            var key = "0x3aeea702333b5f4fca98305ae918c14904415fe586a186361fb4569bfe65d99d";

            await this.contract.mintFromSolution(key, { from: account_one });

            let result = await this.contract.ownerOf.call(222);
            assert.equal(result, account_two, "Token should have been minted");
            result = await this.contract.tokenURI.call(222);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/222", result, "Should match token URI");
        })
    });
})
