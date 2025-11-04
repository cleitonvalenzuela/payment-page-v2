import { IP_API_KEY } from "$env/static/private";

export const getIPDetails = async (ip_address) => {
    const request = await fetch(`https://api.ipapi.is/?q=${ip_address}&key=${IP_API_KEY}`);
    if(request.status == 200){
        const response = await request.json();
        return response;
    }
}