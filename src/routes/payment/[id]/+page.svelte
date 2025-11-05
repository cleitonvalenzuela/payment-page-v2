<script>
    import { onDestroy, onMount } from "svelte";
    import QRCode from 'qrcode';
    import { BuildURL } from "$lib/url.js";

    let { data } = $props();

    let has_copied = $state(false);
    let is_loading = $state(false);
    let show_details = $state(false);
    let approved_payment = $state(false);

    let counter_interval = $state();
    let redirect_interval = $state();

    let qrcode_image = $state();
    let url_params = $state({});

    const FormatTimer = (value) => {
        const totalSeconds = Math.floor(value);       // garante inteiro
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;               // agora é sempre inteiro
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    let counter = $state(data.counter);

    const CopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(data.payment.pix_code);
            has_copied = true;

            setTimeout(() => {
                has_copied = false;
            }, 2000);
        }
        catch (err) {
            console.error('Erro ao copiar:', err);
        }
    }

    const GenerateNewPayment = async () => {
        if(is_loading || approved_payment) return;

        is_loading = true;

        const url_params = Object.fromEntries(new URLSearchParams(window.location.search));

        const request = await fetch("/api/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname: data?.payment?.fullname,
                email: data?.payment?.email,
                phone: data?.payment?.phone,
                document: data?.payment?.document
            })
        });

        if(request.status == 200){
            const response = await request.json();
            window.location.href = BuildURL(`/payment/${response?.payment?.id}`, url_params);
        }
        else{
            is_loading = false;
        }
    }

    const VerifyPayment = async () => {
        if(!data?.payment?.id || is_loading || approved_payment) return;

        const request = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data?.payment?.id
            })
        });

        const response = await request.json();
        if (response.status === 'approved') {
            approved_payment = true;
            clearInterval(redirect_interval);
            window.location.href = BuildURL(response.url, url_params);
        }
    }

    const UpdateCounter = () => {
        if(counter > 0){
            counter -= 1;
        }
        else{
            clearInterval(counter_interval);
            clearInterval(redirect_interval);
        }
    }

    onMount(() => {
        const url_params = Object.fromEntries(new URLSearchParams(window.location.search));
        
        counter_interval = setInterval(UpdateCounter, 1000);
        redirect_interval = setInterval(VerifyPayment, 5000);

        return () => {
            clearInterval(counter_interval);
            clearInterval(redirect_interval);
        }
    });

    $effect(async () => {
        qrcode_image = await QRCode.toDataURL(data.payment.pix_code, { errorCorrectionLevel: "Q" });
    });
</script>

<div class="min-h-screen bg-gray-100 font-sans">
    {#if has_copied}
        <div class="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-in slide-in-from-right">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
            Código PIX copiado!
        </div>
    {/if}
    <div class="mx-auto max-w-[448px] bg-white min-h-screen">
        <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-center"><img src="/logo-govbr.png" alt="gov.br" class="h-8 w-auto"></div>
        </div>
        <div class="px-6 py-6 space-y-6">
            {#if counter <= 0}
                <div class="text-center">
                    <h1 class="text-lg font-semibold text-red-600 leading-tight mb-4">Código PIX Expirado</h1>
                    <p class="text-gray-700 text-sm mb-6">O código PIX expirou após 15 minutos. Clique no botão abaixo para gerar um novo código e continuar com o pagamento.</p>
                    <button type="button" onclick={GenerateNewPayment} class={`whitespace-nowrap text-sm transition-all disabled:pointer-events-none [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 has-[&gt;svg]:px-3 w-full ${is_loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 hover:cursor-pointer"} text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2`} disabled={is_loading}>{is_loading ? "Aguarde..." : "Gerar Novo PIX"}</button>
                </div>
            {:else}
                <div class="text-center">
                    <h1 class="text-lg font-semibold text-gray-800 leading-tight">Falta pouco! Para receber seus valores, efetue o pagamento com PIX!</h1>
                </div>
                <div class="text-center">
                    <p class="text-gray-600 text-sm">O código expira em: <span class="text-red-500 font-semibold">{FormatTimer(counter)}</span></p>
                </div>
                <div class="text-center">
                    <p class="text-gray-700 text-sm mb-4">Escaneie o QR Code com seu aplicativo de pagamento:</p>
                    <div class="flex justify-center mb-4">
                        <div class="bg-white p-3 rounded-lg border w-46 h-46 border-gray-300 shadow-sm">
                            {#if qrcode_image}
                                <img src={qrcode_image} alt="QR Code PIX" class="w-40 h-40 mx-auto">
                            {/if}
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">ou</p>
                </div>
                <div class="text-center">
                    <p class="text-gray-700 text-sm">Copie a chave abaixo e utilize a<br>opção <strong>PIX Copia e Cola:</strong></p>
                </div>
                <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">Código PIX (Copia e Cola)</label>
                    <div onclick={CopyToClipboard} class="bg-gray-50 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden">
                        <div class="font-mono text-xs text-gray-700 truncate">{data.payment.pix_code}</div>
                    </div>
                    <button type="button" onclick={CopyToClipboard} data-slot="button" class="whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none hover:cursor-pointer [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 has-[&gt;svg]:px-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
                        </svg>
                        COPIAR CÓDIGO
                    </button>
                </div>
                <div class="text-center">
                    <p class="text-gray-600 text-sm">Valor a ser pago: <span class="text-green-600 font-semibold">R$ 48,00</span></p>
                </div>
            {/if}
            <div class="border border-gray-200 rounded-lg">
                <div class="px-4 py-3"><span class="font-medium text-gray-800">Instruções para pagamento</span></div>
                <div class="px-4 pb-4 space-y-4">
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16 12 18.5 15.5 16 12 13.5z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-gray-700">Após copiar o código, abra seu aplicativo de pagamento onde você utiliza o Pix.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-gray-700">Escolha a opção <strong>PIX Copia e Cola</strong> e insira o código copiado.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16 12 18.5 15.5 16 12 13.5z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-gray-700">Confirme as informações e efetue o pagamento.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border border-gray-200 rounded-lg">
                <button type="button" onclick={() => show_details = !show_details} class="w-full px-4 py-3 flex items-center justify-between text-left hover:cursor-pointer">
                    <span class="font-medium text-gray-800">Detalhes da compra:</span>
                    <svg width="16" height="16" fill="#666" viewBox="0 0 24 24" class="transform transition-transform ">
                        <path d="M7 10l5 5 5-5z"></path>
                    </svg>
                </button>
                {#if show_details}
                    <div class="px-4 pb-4 space-y-2">
                        <div class="flex justify-between"><span class="text-sm text-gray-600">Produto:</span><span class="text-sm font-medium">Processamento de Resgate</span></div>
                        <div class="flex justify-between"><span class="text-sm text-gray-600">Valor:</span><span class="text-sm font-medium">R$ 48,00</span></div>
                        <div class="flex justify-between"><span class="text-sm text-gray-600">Método:</span><span class="text-sm font-medium">PIX</span></div>
                    </div>
                {/if}
            </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex items-center justify-center gap-4">
                <div class="flex items-center gap-2">
                    <svg width="24" height="24" fill="#00AA5B" viewBox="0 0 24 24">
                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"></path>
                    </svg>
                    <span class="text-sm font-semibold text-green-600">PIX</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg width="16" height="16" fill="#666" viewBox="0 0 24 24">
                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"></path>
                    </svg>
                    <span class="text-xs text-gray-600">Ambiente seguro</span>
                </div>
            </div>
        </div>
    </div>
</div>