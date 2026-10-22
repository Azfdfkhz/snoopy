import { processMessage } from "../../../lib/telegram.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 12_000;
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (body, status = 200, extra = {}) => Response.json(body, { status, headers: { ...headers, ...extra } });

// Cek cepat: buka /api/message di browser untuk memastikan fungsi aktif dan variabel terbaca.
export async function GET() {
  return json({
    ok: true,
    function: "aktif",
    telegram_token_terisi: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    telegram_chat_id_terisi: Boolean(process.env.TELEGRAM_CHAT_ID)
  });
}

export async function POST(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: "Ukuran pesan terlalu besar." }, 413);

  let data;
  try {
    data = JSON.parse(raw || "{}");
  } catch {
    return json({ error: "Format pesan tidak valid." }, 400);
  }

  const forwarded = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const key = forwarded || request.headers.get("x-real-ip") || "unknown";

  const { status, body } = await processMessage(data, key);
  return json(body, status);
}

export async function PUT() {
  return json({ error: "Metode tidak diizinkan." }, 405, { Allow: "GET, POST" });
}
export const DELETE = PUT;
export const PATCH = PUT;
