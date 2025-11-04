import { locations } from "./locations";

export const removeNonDigits = (value) => {
    if(!value) return;
    return value.replace(/\D/g, '');
}

export const normalizeString = (value) => {
    if(!value) return;
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export const formatCurrency = (value, currency) => {
    if(!value) return;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency }).format(value);
}

export const formatDateTime = (value) => {
    if(!value) return;
    value = new Date(value);
    const formatted = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(value);

    return formatted.replace(', ', ' às ');
}

export const capitalizeWords = (value) => {
    if(!value) return;
    return value
        .toLowerCase()
        .split(' ')
        .map(word => {
            const [first, ...rest] = word;
            return first ? first.toLocaleUpperCase() + rest.join('') : '';
        })
        .join(' ');
}

export const applyMask = (value, mask) => {
    if(!value) return;
    value = value.replace(/\D/g, '');
    let result = '';
    let i = 0;
    
    for (const m of mask) {
        if (m === '0') {
            result += value[i] ?? '';
            i++;
        }
        else {
            result += m;
        }
    }

    return result;
}

export const parsePhone = (value) => {
    if(!value) return;
    const digits = value.replace(/\D/g, '');
    
    // ordena os códigos do maior para o menor para evitar colisões (ex: +1 e +12)
    const ordered = [...locations].sort(
        (a, b) => b.code.replace(/\D/g, '').length - a.code.replace(/\D/g, '').length
    );
    
    for (const local of ordered) {
        const code = local.code.replace(/\D/g, '');
    
        if (digits.startsWith(code)) {
            const number = digits.slice(code.length);
            const mask = local.phone[0];
            const formated = applyMask(number, mask);
        
            return {
                location: local.iso,
                number: formated,
            };
        }
    }
    
    return null; // código não encontrado
}

export const getFirstName = (value) => {
    if (!value) return '';
  
    return value.trim().split(' ')[0];
}

export const formatCounter = (value) => {
    if (typeof value !== 'number') value = Number(value);
    if (isNaN(value)) return '';

    const abs = Math.abs(value);
    let formatted = '';

    if (abs >= 1_000_000) {
        formatted = (value / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'm';
    } else if (abs >= 1_000) {
        formatted = (value / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'k';
    } else {
        formatted = value.toFixed(2).replace(/\.?0+$/, '');
    }

    return formatted;
}