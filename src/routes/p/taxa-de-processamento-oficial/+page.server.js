import { removeNonDigits } from "$lib/formating";
import { getRandomEmail } from "$lib/random.js";
import { supabase } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';

export const load = async ({ url, parent, params, locals, cookies }) => {
    const fullname = url.searchParams.get("nome");
    const document = removeNonDigits(url.searchParams.get("cpf"));

    throw error(404, 'Not Found');

    return { fullname, document }
}