import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ohcitblnqeqoetfghbwu.supabase.co"
const supabaseKey = "sb_publishable_UX3p_fIMWQFCxGko6elJbQ_ftrUZUL6"

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase