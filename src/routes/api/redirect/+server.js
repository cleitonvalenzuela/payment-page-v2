import { supabase } from '$lib/supabase';
import { getIPDetails } from '$lib/ip.js';

import { URL_PAYMENT } from "$env/static/private";

const GetTodayNet = async () => {
    // Pegar data de hoje (00:00:00) e amanhã (00:00:00) para usar no intervalo
    const today = new Date();
    today.setHours(0, 0, 0, 0); // hoje 00:00:00
  
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // amanhã 00:00:00
  
    // Converter para ISO (UTC)
    const todayISO = today.toISOString();
    const tomorrowISO = tomorrow.toISOString();
  
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .gte('created_at', todayISO)
      .lt('created_at', tomorrowISO)
      .gt('net', 0);
  
    if (error) {
        console.error('Erro ao buscar registros:', error);
        return [];
    }

    const total_net = data.reduce((acc, row) => acc + Number(row.net), 0);
    return total_net;
}

export const GET = async ({ request }) => {
    /*
    const x_forwardedfor = request.headers.get('x-forwarded-for');
    const ip_address = x_forwardedfor ? x_forwardedfor.split(',')[0].trim() : null;

    let ip_details = await getIPDetails(ip_address);
    let total_net = await GetTodayNet();
    let url = URL_PAYMENT;
    
    let redirect; //  && ip_details?.is_vpn == false && ip_details?.is_proxy == false
    if(total_net < 500 && ip_details && ip_details?.location?.state.toLowerCase() != "minas gerais"){
        redirect = true;
    }
    else{
        redirect = false;
    }
    */

    let redirect = false;
    let url = "";

    return new Response(JSON.stringify({
        redirect,
        url
    }), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}