/* NUDGE 4.0 backend adapter.
   Cloud mode uses Supabase Auth + a Postgres JSONB user_state row.
   If credentials are empty, NUDGE safely falls back to its local prototype mode. */
(function () {
  const cfg = window.NUDGE_SUPABASE || {};
  let client = null;
  if (cfg.url && cfg.anonKey && window.supabase?.createClient) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }

  window.NUDGE_BACKEND = {
    enabled: !!client,
    client,
    async session() {
      if (!client) return null;
      const { data } = await client.auth.getSession();
      return data.session || null;
    },
    async signUp({ email, password, name }) {
      if (!client) throw new Error('Cloud backend is not configured.');
      const { data, error } = await client.auth.signUp({
        email, password,
        options: { data: { display_name: name } }
      });
      if (error) throw error;
      return data;
    },
    async signIn({ email, password }) {
      if (!client) throw new Error('Cloud backend is not configured.');
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    async signOut() {
      if (!client) return;
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },
    async loadState(userId) {
      if (!client) return null;
      const { data, error } = await client.from('user_state').select('state').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data?.state || null;
    },
    async saveState(userId, state) {
      if (!client) return;
      const clean = JSON.parse(JSON.stringify(state));
      delete clean.pass; // passwords must never enter our application state table.
      const { error } = await client.from('user_state').upsert({ user_id: userId, state: clean, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      if (error) throw error;
    }
  };
})();
