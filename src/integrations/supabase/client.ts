import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://daeabxmadmvmgirzfmbe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZWFieG1hZG12bWdpcnpmbWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1OTY2MzMsImV4cCI6MjA0OTE3MjYzM30.tiZf8Tmefgz0mDB5VLI7Oa95Sw0tSFHPDu-9tK_Cg4o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);