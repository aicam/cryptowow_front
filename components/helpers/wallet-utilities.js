import * as ethUtil from "ethereumjs-util";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { providers } from "ethers";
import { eip1271 } from "./eip1271";
import { SUPPORTED_CHAINS } from "./chains";
import BigNumber from "bignumber.js";

export function encodePersonalMessage(msg) {
  const data = ethUtil.toBuffer(convertUtf8ToHex(msg));
  const buf = Buffer.concat([
    Buffer.from("\u0019Ethereum Signed Message:\n" + data.length.toString(), "utf8"),
    data,
  ]);
  return ethUtil.bufferToHex(buf);
}

export function hashMessage(msg) {
  const data = encodePersonalMessage(msg);
  const buf = ethUtil.toBuffer(data);
  const hash = ethUtil.keccak256(buf);
  return ethUtil.bufferToHex(hash);
}

export function getChainData(chainId) {
  const chainData = SUPPORTED_CHAINS.filter((chain) => chain.chain_id === chainId)[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = process.env.APP_INFURA_PROJECT_ID;

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export function recoverAddress(sig, hash) {
  const params = ethUtil.fromRpcSig(sig);
  const result = ethUtil.ecrecover(ethUtil.toBuffer(hash), params.v, params.r, params.s);
  const signer = ethUtil.bufferToHex(ethUtil.publicToAddress(result));
  return signer;
}

export async function verifySignature(
  address,
  sig,
  hash,
  chainId,
) {
  const rpcUrl = getChainData(chainId).rpc_url;
  const provider = new providers.JsonRpcProvider(rpcUrl);
  const bytecode = await provider.getCode(address);
  if (!bytecode || bytecode === "0x" || bytecode === "0x0" || bytecode === "0x00") {
    const signer = recoverAddress(sig, hash);
    return signer.toLowerCase() === address.toLowerCase();
  } else {
    return eip1271.isValidSignature(address, sig, hash, provider);
  }
}

export function sanitizeHex(hex) {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") {
    return "";
  }
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
}



export function convertStringToHex(value) {
  return new BigNumber(`${value}`).toString(16);
}

export function convertAmountToRawNumber(value, decimals = 18) {
  return new BigNumber(`${value}`).times(new BigNumber("10").pow(decimals)).toString();
}
