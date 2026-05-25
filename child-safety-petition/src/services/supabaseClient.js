import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tianddxbstrzrubqetrs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYW5kZHhic3RyenJ1YnFldHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTk2MzEsImV4cCI6MjA5NTI3NTYzMX0.QukRfyz4QFaBH-64KYKD3193qO8oSJmbJM6F7hePH_w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
