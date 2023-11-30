export const dynamic = "force-dynamic"; // defaults to force-static
const BASE_URL = process.env.NEXT_PUBLIC_API;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function getPinyins(char: string) {
  const res = await fetch(BASE_URL + "/pinyins/" + char, {
    headers: corsHeaders,
  });
  const data = await res.json();

  console.log("Res pinyins", data);

  return Response.json({ data });
}

export async function getCollecitons() {
  const res = await fetch(BASE_URL + "/collections", {
    headers: corsHeaders,
  });
  const data = await res.json();

  console.log("Res collections", data);

  return Response.json({ data });
}

export async function getTexts() {
  const res = await fetch(BASE_URL + "/texts", {
    headers: corsHeaders,
  });
  const data = await res.json();

  console.log("Res texts", data);

  return Response.json({ data });
}
