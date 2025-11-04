<script>
	let { value = $bindable(""), error="" } = $props();

	// função que aplica a máscara
	const formatCPF = (v) => {
		const digits = v.replace(/\D/g, '').slice(0, 11); // só números, máximo 11
		if (digits.length <= 3) return digits;
		if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
		if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
		return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
	}

	const handleInput = (event) => {
		const el = event.target;
		const cursor = el.selectionStart;

		// conta quantos dígitos havia antes do cursor
		const digitsBefore = el.value.slice(0, cursor).replace(/\D/g, '').length;

		// aplica máscara
		const formatted = formatCPF(el.value);
		value = formatted; // <-- mantém o binding reativo
	}

	const caretIndexForDigitCount = (formatted, digitCount) => {
		let count = 0;
		for (let i = 0; i < formatted.length; i++) {
			if (/\d/.test(formatted[i])) {
				count++;
				if (count === digitCount) return i + 1;
			}
		}
		return formatted.length;
	}
</script>

<div>
	<label class="block font-medium mb-2 text-gray-700 text-sm sm:text-base" for="cpf">CPF</label>
	<input
		bind:value={value}
		oninput={handleInput}
		class={`file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 min-w-0 bg-transparent shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring ring-gray-300 ${error ? "border-red-500" : "focus-within:border-gray-400 border-gray-300"} focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full p-3 sm:p-4 border rounded-lg text-sm sm:text-base transition-colors placeholder:text-gray-400 border-gray-300`}
		placeholder="Digite o número do seu CPF"
		maxlength="14"
		autocomplete="off"
		inputmode="numeric"
		spellcheck="false"
		type="text"
		name="cpf"
	/>
	{#if error}
		<div class="flex items-center gap-2 text-red-600 text-xs sm:text-sm mt-1">
			<div class="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
				<span class="text-white text-xs font-bold">!</span>
			</div>
			{error}
		</div>
	{/if}
</div>