import { randomUUID } from 'crypto';
import { PODPAY_PRIVATE_KEY, PODPAY_PUBLIC_KEY } from "$env/static/private";

const getNewExpiration = () => {
    const now = new Date();
    const future = new Date(now.getTime() + 15 * 60 * 1000); // soma 15 minutos
    return future;
}

export const createNewPayment = async (document, fullname, email, phone, amount, ip) => {
    const id = randomUUID();
    const authorization = "Basic " + Buffer.from(PODPAY_PUBLIC_KEY + ':' + PODPAY_PRIVATE_KEY).toString('base64');

    const request = await fetch("https://api.podpay.pro/v1/transactions", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": authorization,
        },
        body: JSON.stringify({
            "amount": amount * 100,
            "paymentMethod": "pix",
            "items": [{
                "title": "Ebook: Confeitaria Caseira",
                "unitPrice": amount * 100,
                "quantity": 1,
                "tangible": false
            }],
            "customer": {
                "name": fullname,
                "email": email,
                "document": {
                    "number": document,
                    "type": "cpf"
                }
            }
        })
    });

    let expiration = getNewExpiration();
    
    if(request.status == 200){
        const response = await request.json();
        return {
            id: id,
            reference: response?.id,
            expiration: expiration,
            pix_code: response?.pix?.qrcode
        };
    }
    else{
        const response = await request.text();
        console.error(`Error generating payment: `, response);
        console.log(JSON.stringify({
            "amount": amount * 100,
            "paymentMethod": "pix",
            "items": [{
                "title": "Ebook: Confeitaria Caseira",
                "unitPrice": amount * 100,
                "quantity": 1,
                "tangible": false
            }],
            "customer": {
                "name": fullname,
                "email": email,
                "document": {
                    "number": document,
                    "type": "cpf"
                }
            }
        }));
    }

    return false;
}