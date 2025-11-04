import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

import { RETURN_URL } from "$env/static/private";

export const POST = async ({ request, locals, getClientAddress, cookies }) => {
    const body = await request.json();

    const payment_id = body.id;

    const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq('id', payment_id);

    if(error){
        throw console.error(`Error quering payment: `, error);
    }

    return json({
        status: data?.[0]?.status,
        url: RETURN_URL
    });
}