import { error, json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase'; 

export const POST = async ({ request, locals, getClientAddress, cookies }) => {
    const body = await request.json();

    const reference = body?.id;
    const status = body?.data?.status;
    
    let received;
    if(status == "approved" || status == "paid"){
        received = body?.data?.fee?.netAmount / 100;
    }
    else if(status == "refunded" || status == "chargeback"){
        received = 0;
    }

    await supabase
        .from("payments")
        .update({ status, received })
        .eq('reference', reference);

    return new Response("OK");
}