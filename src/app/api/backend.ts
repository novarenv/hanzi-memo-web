export const dynamic = "force-dynamic"; // defaults to force-static
const BASE_URL = process.env.NEXT_PUBLIC_API;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface D<T> {
  data: T
}

interface Pinyin {
  id: string
  zh_sc?: string
  zh_tc?: string
  pinyin?: string
}

export interface Segment {
  segment: string
  is_visible: boolean
  strict_visible: boolean
  pinyin: Pinyin[]
}

export interface Collection {
  id: string
  name: string
  preview: Pinyin[]
}

const options = {headers: corsHeaders};

export async function getPinyins(
    char: string,
    lexBlacklist: string[],
    lexWhitelist: string[],
    collBlacklist: string[],
) {
  const urlParam = new URLSearchParams({
    blacklist_collection: collBlacklist.join(","),
    blacklist_lexeme: lexBlacklist.join(","),
  })

  const res = await fetch(`${BASE_URL}/pinyins/${char}?` + urlParam, options);
  return await res.json() as Promise<D<Segment[]>>;
}

export async function getCollections() {
  const res = await fetch(BASE_URL + "/collections", options);
  return await res.json() as Promise<D<Collection[]>>;
}

export interface SampleText {
  id: string
  title: string
  text: string
}

export async function getTexts() {
  const res = await fetch(`${BASE_URL}/texts`, options);
  return await res.json() as Promise<D<SampleText[]>>;
}
