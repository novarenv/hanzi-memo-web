export const dynamic = "force-dynamic"; // defaults to force-static

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {

  const res = await fetch("https://hz.youcantry.me/api/pinyins/爱", {
    headers: corsHeaders
  });
  const data = await res.json();

  console.log("Res", data)

  return Response.json(
    { data },
  );
}
