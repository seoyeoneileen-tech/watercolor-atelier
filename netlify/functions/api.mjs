// 풍경 수채화 작품첩 서버: Netlify Blobs에 명단과 그림을 저장합니다.
// 로그인 없이 링크를 아는 누구나 보고, 올리고, 고칠 수 있습니다.
import { getStore } from "@netlify/blobs";

const MEMBERS = 16;
const pad = (n) => String(n).padStart(2, "0");
const json = (d, status = 200) =>
  new Response(JSON.stringify(d), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export default async (req) => {
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const data = getStore({ name: "atelier", consistency: "strong" });
  const imgs = getStore({ name: "paintings", consistency: "strong" });

  const validId = (id) => Number.isInteger(id) && id >= 1 && id <= MEMBERS;
  const validWeek = (w) => Number.isInteger(w) && w >= 1 && w <= 6;
  const getMember = async (id) =>
    (await data.get(`member/${pad(id)}`, { type: "json" })) || { id, name: `회원 ${pad(id)}`, sort: id, works: {} };
  const putMember = (m) => data.setJSON(`member/${pad(m.id)}`, m);

  try {
    // 전체 명단과 작품 목록
    if (req.method === "GET" && parts[0] === "state") {
      const members = await Promise.all(Array.from({ length: MEMBERS }, (_, i) => getMember(i + 1)));
      return json({ members });
    }

    // 이름 수정
    if (req.method === "POST" && parts[0] === "name") {
      const body = await req.json().catch(() => ({}));
      const id = Number(body.id);
      const name = String(body.name || "").trim().slice(0, 20);
      if (!validId(id) || !name) return json({ error: "bad_request" }, 400);
      const m = await getMember(id);
      m.name = name;
      await putMember(m);
      return json({ ok: true });
    }

    // 그림 올리기·교체(PUT), 삭제(DELETE)
    if (parts[0] === "work") {
      const id = Number(url.searchParams.get("id"));
      const week = Number(url.searchParams.get("week"));
      if (!validId(id) || !validWeek(week)) return json({ error: "bad_request" }, 400);
      const m = await getMember(id);
      m.works = m.works || {};
      const old = m.works[week];

      if (req.method === "PUT") {
        const type = (req.headers.get("content-type") || "").split(";")[0].trim();
        if (!/^image\/(jpeg|png|webp)$/.test(type)) return json({ error: "unsupported_type" }, 415);
        const buf = await req.arrayBuffer();
        if (!buf.byteLength || buf.byteLength > 5_500_000) return json({ error: "too_large" }, 413);
        const key = `m${pad(id)}-w${week}-${Date.now()}`;
        await imgs.set(key, buf, { metadata: { type } });
        m.works[week] = { key, updated_at: new Date().toISOString() };
        await putMember(m);
        if (old && old.key) await imgs.delete(old.key).catch(() => {});
        return json({ ok: true, key });
      }
      if (req.method === "DELETE") {
        delete m.works[week];
        await putMember(m);
        if (old && old.key) await imgs.delete(old.key).catch(() => {});
        return json({ ok: true });
      }
    }

    // 그림 파일 보여주기
    if (req.method === "GET" && parts[0] === "img" && parts[1]) {
      const key = decodeURIComponent(parts[1]);
      if (!/^m\d{2}-w[1-6]-\d+$/.test(key)) return new Response("Not found", { status: 404 });
      const r = await imgs.getWithMetadata(key, { type: "arrayBuffer" });
      if (!r) return new Response("Not found", { status: 404 });
      return new Response(r.data, {
        headers: {
          "content-type": (r.metadata && r.metadata.type) || "image/jpeg",
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }

    return json({ error: "not_found" }, 404);
  } catch (e) {
    console.error(e);
    return json({ error: "server_error" }, 500);
  }
};

export const config = { path: "/api/*" };
