import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const metaRows = await query<{
      db: string;
      user: string;
      schema: string;
      search_path: string;
      server_addr: string | null;
      server_port: number | null;
      version: string;
    }>(`
      select
        current_database() as db,
        current_user as user,
        current_schema() as schema,
        current_setting('search_path') as search_path,
        inet_server_addr()::text as server_addr,
        inet_server_port() as server_port,
        version() as version
    `);
    const meta = metaRows[0];

    const tables = await query<{ table_schema: string; table_name: string }>(`
      select table_schema, table_name
      from information_schema.tables
      where table_schema = 'public'
      order by 1,2
      limit 200
    `);

    // Does public.menu_items exist?
    const existsRows = await query<{ exists: boolean }>(`
      select (to_regclass('public.menu_items') is not null) as exists
    `);
    const menuTableExists = Boolean(existsRows?.[0]?.exists);

    let menuCount: number | null = null;
    let menuError: string | null = null;
    try {
      const rows = await query<{ count: string }>(`select count(*)::text as count from public.menu_items`);
      menuCount = parseInt(rows[0]?.count ?? '0', 10);
    } catch (e: any) {
      menuError = e?.message || String(e);
    }

    return NextResponse.json({
      ok: true,
      meta,
      menuTableExists,
      menuCount,
      menuError,
      tables
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'db error' },
      { status: 500 }
    );
  }
}