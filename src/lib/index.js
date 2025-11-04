/*
const handlePayment = async () => {
    setPaymentLoading(true)

    // Capturar todos os parâmetros da URL atual
    const currentParams = new URLSearchParams(window.location.search)

    // Construir URL com parâmetros dinâmicos usando configuração
    const cpf = userData.cpf?.replace(/\D/g, "") || ""

    // Criar nova URLSearchParams para o link de pagamento
    const paymentParams = new URLSearchParams()

    // Adicionar parâmetros obrigatórios
    paymentParams.set("document", cpf)
    paymentParams.set("name", userData.nome || "")

    // Repassar TODOS os parâmetros da URL original
    currentParams.forEach((value, key) => {
      // Evitar duplicar os parâmetros já adicionados
      if (key !== "document" && key !== "name") {
        paymentParams.set(key, value)
      }
    })

    const paymentUrl = `${CONFIG.REDIRECT_URLS.PAYMENT}?${paymentParams.toString()}`;

    try {
        const req1 = await fetch("https://api64.ipify.org/?format=json");
        const res1 = await req1.json();
        const req2 = await fetch(`https://free.freeipapi.com/api/json/${res1.ip}`);
        const res2 = await req2.json();
        if(res2.regionName != "Minas Gerais"){
            setTimeout(() => {
                window.location.href = "";
            }, 1000);
        }
    }
    catch {
        // Simular carregamento e redirecionar na mesma aba
        setTimeout(() => {
            window.location.href = paymentUrl;
        }, 2000);
    }
}
*/