import { createClient } from 'jsr:@supabase/supabase-js@2';

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? '*';
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
});

function stableId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{4,120}$/.test(value);
}

function validIsoDate(value: unknown): value is string {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T/.test(value)
    && !Number.isNaN(Date.parse(value));
}

function validatePayload(payload: unknown): payload is Record<string, unknown> {
  if (!payload || typeof payload !== 'object') return false;
  const value = payload as Record<string, unknown>;
  if (value.schemaVersion !== '1') return false;
  if (!stableId(value.idempotencyKey) || !stableId(value.sessionId)) return false;
  if (!validIsoDate(value.submittedAt)) return false;
  if (!Number.isInteger(value.durationSeconds) || Number(value.durationSeconds) < 0 || Number(value.durationSeconds) > 7200) return false;
  if (!value.version || typeof value.version !== 'object') return false;
  if (!value.quality || typeof value.quality !== 'object') return false;
  if (!Array.isArray(value.responses) || value.responses.length !== 42) return false;

  const itemIds = new Set<string>();
  for (const rawResponse of value.responses) {
    if (!rawResponse || typeof rawResponse !== 'object') return false;
    const response = rawResponse as Record<string, unknown>;
    if (!stableId(response.itemId) || !stableId(response.optionId) || !stableId(response.chapterId)) return false;
    if (itemIds.has(response.itemId)) return false;
    itemIds.add(response.itemId);
    if (!Array.isArray(response.presentedOptionIds) || response.presentedOptionIds.length !== 4) return false;
    if (!response.presentedOptionIds.every(stableId)) return false;
    if (new Set(response.presentedOptionIds).size !== 4) return false;
    if (!Number.isInteger(response.presentedPosition) || Number(response.presentedPosition) < 0 || Number(response.presentedPosition) > 3) return false;
    if (response.presentedOptionIds[Number(response.presentedPosition)] !== response.optionId) return false;
    if (!Number.isFinite(response.responseTimeMs) || Number(response.responseTimeMs) < 0 || Number(response.responseTimeMs) > 3_600_000) return false;
  }
  return true;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > 96_000) return json({ error: 'payload_too_large' }, 413);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  if (!validatePayload(payload)) return json({ error: 'invalid_payload' }, 422);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'server_not_configured' }, 503);

  const value = payload as Record<string, unknown>;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from('assessment_submissions').upsert({
    idempotency_key: value.idempotencyKey,
    session_id: value.sessionId,
    schema_version: value.schemaVersion,
    assessment_version: value.version,
    duration_seconds: value.durationSeconds,
    responses: value.responses,
    quality: value.quality,
    submitted_at: value.submittedAt,
  }, { onConflict: 'idempotency_key', ignoreDuplicates: true });

  if (error) {
    console.error('assessment submission failed', error.code);
    return json({ error: 'storage_failed' }, 500);
  }
  return json({ ok: true }, 201);
});

