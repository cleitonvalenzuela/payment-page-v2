import { error, json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { getBrazilianPhoneNumber, getRandomEmail } from '$lib/random';
import { supabase } from '$lib/supabase'; 
import { createNewPayment } from "$lib/payments";
import { validateDocument, validateEmail, validateFullname, validatePhone } from '$lib/validations';

export const POST = async ({ request, locals, getClientAddress, cookies }) => {
    const body = await request.json();
    const fullname = body.fullname;
    const document = body.document;
    const email = body.email;
    const phone = body.phone;

    const x_forwardedfor = request.headers.get('x-forwarded-for');
    const ip_address = x_forwardedfor ? x_forwardedfor.split(',')[0].trim() : null;

    // Verifica se todos os dados sao validos.
    if(validateFullname(fullname) && validateDocument(document)){
        const payment = await createNewPayment(document, fullname, email, phone, 48.00, ip_address);
        console.log("New payment:", payment);

        const { data, error } = await supabase
            .from("payments")
            .insert([{
                id: payment?.id,
                fullname: fullname,
                document: document,
                email: email,
                phone: phone,
                reference: payment?.reference,
                expiration: payment?.expiration,
                pix_code: payment?.pix_code,
                status: "pending"
            }])
            .select('*');

        if(error){
            throw console.error(`Error inserting payment: `, error);
        }

        cookies.set("payment", payment?.id, {
            path: '/',           // Caminho onde o cookie é válido
            httpOnly: true,      // Impede acesso via JavaScript no navegador
            sameSite: 'strict',  // Evita envio do cookie para outros sites
            secure: false,        // Somente via HTTPS
            maxAge: 60 * 60 * 24 // Expira em 1 dia
        });

        return json({
            payment: {
                id: data?.[0]?.id,
                reference: data?.[0]?.reference,
                pix_code: data?.[0]?.pix_code,
                created_at: data?.[0]?.created_at
            }
        });
    }
    else{
        console.log("Validate data:", fullname, document, email, phone);
        console.log(validateFullname(fullname), validateDocument(document), validateEmail(email), validatePhone(phone));
        return error(400, "Parametros inválidos");
    }
}