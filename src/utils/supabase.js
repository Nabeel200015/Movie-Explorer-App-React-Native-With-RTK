import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';



const supabaseUrl = 'https://asueszeltyfqaqewpyfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdWVzemVsdHlmcWFxZXdweWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDU4OTMsImV4cCI6MjA2OTk4MTg5M30.jzJMRfgqygiVWyx7O3VpCczE0vTwuhxIXCaTH4p09wk';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: (...args) => fetch(...args),
    },

})
export default supabase;