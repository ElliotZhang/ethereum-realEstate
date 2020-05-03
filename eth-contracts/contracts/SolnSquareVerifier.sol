pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    using SafeMath for uint256;

    Verifier private _verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address addr;
        bool used;
    }

    // TODO define an array of the above struct
    Solution[] public solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutionSubmitted;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 solutionHash, uint256 tokenId, address _address);

    constructor(string memory _name, string memory _symbol, address _address) ERC721Mintable(_name, _symbol) public {
        if (_address != address(0)) {
            _verifier = Verifier(_address);
        }
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input,
            uint256 tokenId) public returns (bool r) {

        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));

        require(solutionSubmitted[key].addr == address(0), "Solution has been submitted before");

        bool verified = _verifier.verifyTx(a, b, c, input);
        require(verified, "Solution verification falied");

        Solution memory _solution = Solution(tokenId, msg.sender, false);
        solutionSubmitted[key] = _solution;
        solutions.push(_solution);
        emit SolutionAdded(key, tokenId, msg.sender);
        return true;
    }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintFromSolution(bytes32 key) public whenNotPaused() onlyOwner() returns(bool) {
        require(solutionSubmitted[key].addr != address(0), "Solution not valid");
        require(!solutionSubmitted[key].used, "Solution has been used");

        solutionSubmitted[key].used = true;
        uint256 _tokenId = solutionSubmitted[key].index;
        ERC721Enumerable._mint(solutionSubmitted[key].addr, _tokenId);
        setTokenURI(_tokenId);
        return true;
    }
}
