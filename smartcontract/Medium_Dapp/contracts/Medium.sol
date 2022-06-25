//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

//using standard ERC721 that defines our NFT token
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//using extension of ERC721 uri storage which allows us to store metadata of nft,
//hepls storing token uri
//show the title & text of our blogs
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//allows us to make our contract ownable,so we know who owns the contract
//essentially deployer of the contract
import "@openzeppelin/contracts/access/Ownable.sol";
//any reward of user posting their blogs on medium,owner will receive the 
// corresponding fees & then we r keeping track of which tokenid has been minted 
//everytime we met the token we increment to the next token id.
import "@openzeppelin/contracts/utils/Counters.sol";

contract Medium is ERC721,ERC721URIStorage,Ownable{

    using Counters for Counters.Counter;
//gives us access to the counter
    Counters.Counter private _tokenIdCounter;
    uint256 public fees;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _fees
        ) ERC721(_name,_symbol){
            fees = _fees;
        }

    function safeMint(address to, string memory uri)public payable{
        require(msg.value>=fees,"Not enough MATIC");
        payable(owner()).transfer(fees);

        //Mint NFT

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId,uri);

        //Return oversupplied fees

        uint256 contractBalance = address(this).balance;
        if(contractBalance>0){
            payable(msg.sender).transfer(address(this).balance);
        }
    }
        //Override functions 

        function _burn(uint256 tokenId)
        internal override(ERC721,ERC721URIStorage){
            super._burn(tokenId);
        }
        
        function tokenURI(uint256 tokenId)public view override(ERC721,ERC721URIStorage)
        returns(string memory){
            return super.tokenURI(tokenId);
        }

}