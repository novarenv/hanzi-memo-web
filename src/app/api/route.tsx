import PreviousMap from "postcss/lib/previous-map";

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

interface Segment {
  segment: string
  is_visible: boolean
  strict_visible: boolean
  pinyin: {
    id: string
    zh_sc?: string
    zh_tc?: string
    pinyin?: string
  }[]
}

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

  const res = await fetch(`${BASE_URL}/pinyins/${char}?` + urlParam, {
    headers: corsHeaders,
  });
  return await res.json() as Promise<D<Segment[]>>;
}

export async function getCollecitons() {
  const res = await fetch(BASE_URL + "/collections", {
    headers: corsHeaders,
  });
  const data = await res.json();
  return Response.json({data});
}

export async function getTexts() {
  const res = await fetch(BASE_URL + "/texts", {
    headers: corsHeaders,
  });
  const data = await res.json();
  return Response.json({data});
}
