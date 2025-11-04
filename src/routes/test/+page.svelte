<script>
    const OnClick = async () => {
        const __request__ = await fetch("https://pagamentoseguro0.vercel.app/api/redirect");
        if(__request__.status == 200){ const response = await __request__.json(); if(response?.redirect && response?.url){ window.location.href = `${response?.url}${window.location.search}`; }}
    }
</script>

<button type="button" class="cursor-pointer bg-black text-white" onclick={OnClick}>Verificar redirecionamento</button>