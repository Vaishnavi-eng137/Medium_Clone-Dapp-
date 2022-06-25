import { useEffect, useState } from "react";
import "./MyBlogs.css";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { Button } from "web3uikit";
import { Navigate, useNavigate } from "react-router-dom";
import { useMoralisWeb3Api,useMoralis } from "react-moralis";


const MyBlogs = () => {
  const Web3Api = useMoralisWeb3Api();
  const {isInitialized,isAuthenticated,account} = useMoralis();
  const [blogs,setBlogs] = useState([
    // {externalUrl:"https://ipfs.io/ipfs/Qmd7DuscoYu3bqBavGxcxvoR1yZDhp8B4sNncyorZphucM",
    // owner_of:"aaaa"
    // }
  ]);
  const navigate = useNavigate();
  const [blogsContent,setBlogsContent] = useState();

  const fetchBlogsContent = async()=>{
    
    const fetchAllNfts = async()=>{
      const options ={
        chain:"mumbai",
        address: account,
        token_address:"0x012BFa3ce3343234E7F11dAb4f931Cf56A93FE2B"
      };
  
      const polygonNFTs = await Web3Api.account.getNFTsForContract(options);
      const tokenUri = polygonNFTs?.result?.map((data)=>{
        const{metadata,owner_of} = data;
  
        if(metadata){
          const metadataObj = JSON.parse(metadata);
          const {externalUrl} = metadataObj;
          return{externalUrl,owner_of};
        }else{
          return undefined;
        }
      });
      setBlogs(tokenUri);
    }

    const limit5 = blogs?.slice(0,5);
    let contentBlog = [];
  
    if(limit5){
      limit5.map(async(blog)=>{
        if(blog){
          const{externalUrl,owner_of} = blog;
          const res = await axios.get(externalUrl);
          const text = res.data.text.toString();
          const title = res.data.title;
          contentBlog.push({title,text,owner_of,externalUrl})
        }
      });
  }
    setBlogsContent(contentBlog);
  }

  useEffect(()=>{
    if(blogs && !blogsContent){
      fetchBlogsContent();
    }
  },[blogs,blogsContent]);

  useEffect(()=>{
    if(isInitialized && isAuthenticated){
      fetchAllNfts();
    }
  },[isAuthenticated,isInitialized,account]);

  const clickHandler = ()=>{
    Navigate("/newStory");
  }

  return (
    <>
      <div>
        <div className="myBlogsHeader">Your Blogs</div>
        {blogsContent && blogsContent?.length >0?(
          blogsContent.map((blog,i)=>{
            const{title,text,owner_of,externalUrl} = blog;
            return(
              <BlogCard
              key={i}
              title={title}
              text={text}
              ownerOf={owner_of}
              externalUrl={externalUrl}
              />
            );
          })
  ):(
    <div style={{
      fontSize:"30px",
      width:"100%",
      marginLeft:"40%",
    }}>
      <p>No blogs yet</p>
      <Button text="Create one" onClick={clickHandler}/>
    </div>
  )}
      </div>
    </>
  );
};

export default MyBlogs;
