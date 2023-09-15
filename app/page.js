"use client";

import NFTCard from "@/components/NFTCard";
import { useState } from "react";

export default function Home() {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log("Fetching NFTs...");
    const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    const baseUrl = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };

    if (!collection.length) {
      const fetchUrl = `${baseUrl}?owner=${wallet}`;
      nfts = await fetch(fetchUrl, requestOptions).then(data => data.json());
    } else {
      console.log("Fetching NFTs for collection owned by address...");
      const fetchUrl = `${baseUrl}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchUrl, requestOptions).then(data => data.json());
    }

    if (nfts) {
      console.log("nfts: ", nfts);
      setNFTs(nfts.ownedNfts);
    }

    console.log(nfts);
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      const baseUrl = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      const fetchUrl = `${baseUrl}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch (fetchUrl, requestOptions).then(data => data.json());
      if (nfts) {
        console.log("NFTs in collection: ", nfts);
        setNFTs(nfts.nfts);
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          onChange={(e) => setWalletAddress(e.target.value)}
          type="text"
          disabled={fetchForCollection}
          placeholder="Add your wallet address"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        />
        <input
          onChange={(e) => setCollectionAddress(e.target.value)}
          type="text"
          placeholder="Add the collection address"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        />
        <div className="flex items-center">
          <label htmlFor="forCollection">
            <input onChange={(e) => setFetchForCollection(e.target.checked)} type="checkbox" name="forCollection" id="forCollection" />
            Fetch for collection
          </label>
        </div>
        <button onClick={() => {
          if (fetchForCollection) {
            fetchNFTsForCollection();
          } else {
            fetchNFTs();
          }
        }} className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}>Let's go!</button>
      </div>

      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
       {
        NFTs.length && NFTs.map((nft, i) => {
          return (
            <NFTCard nft={nft} key={i} />
          )
        })
       }
      </div>
    </main>
  );
}
