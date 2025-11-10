import { supabase } from '$lib/supabase.js'; 
import { error, redirect } from '@sveltejs/kit';

import { RETURN_URL } from "$env/static/private";

const DiffInSeconds = (date1, date2) => {
    const diffMs = date2.getTime() - date1.getTime();
    return diffMs / 1000;
}

const getPaymentByID = async (id) => {
    const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("id", id)

    if(data.length == 0){
        return;
    }

    return {
        id: data?.[0]?.id,
        fullname: data?.[0]?.fullname,
        email: data?.[0]?.email,
        phone: data?.[0]?.phone,
        document: data?.[0]?.document,
        pix_code: data?.[0]?.pix_code,
        expiration: data?.[0]?.expiration,
        status: data?.[0]?.status
    }
}

export const load = async ({ url, parent, params, locals, cookies }) => {
    const payment = await getPaymentByID(params.id);
    
    if(!payment){
        throw error(404, 'Not Found');
    }

    if(payment && (payment.status == "approved" || payment.status == "paid")){
        throw redirect(302, RETURN_URL);
    }

    let counter = DiffInSeconds(new Date(), new Date(payment.expiration));
    if(counter < 0){
        counter = 0;
    }

    throw error(404, 'Not Found');

    return { payment, counter }
}