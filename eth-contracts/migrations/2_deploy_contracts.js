// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function(deployer) {
    deployer.deploy(Verifier).then(() => {
        return deployer.deploy(SolnSquareVerifier, "MyERC721", "ME", Verifier.address);
    });
};
