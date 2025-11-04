export const validateFullname = (name) => {
	return typeof name === "string" && name.trim().split(" ").length >= 2;
}

export const validateEmail = (value) => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(value);
}

export const validatePhone = (value) => {
	const regex = /^\([0-9]{2}\) [0-9]{5}\-[0-9]{4}$/;
	return regex.test(value.trim());
}

export const validateFilename = (value) => {
	const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\.(jpg|png|jpeg|webp)$/i;
	return regex.test(value);
}

export const validateURL = (value) => {
	try {
		new URL(value);
		return true;
	}
	catch (e) {
		return false;
	}
}

export const validateDocument = (value) => {
	value = value.replace(/[^\d]+/g, '');
	if (value.length !== 11 || /^(\d)\1+$/.test(value)) return false;

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(value.charAt(i)) * (10 - i);
	}
	let firstCheck = (sum * 10) % 11;
	if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
	if (firstCheck !== parseInt(value.charAt(9))) return false;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(value.charAt(i)) * (11 - i);
	}
	let secondCheck = (sum * 10) % 11;
	if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
	if (secondCheck !== parseInt(value.charAt(10))) return false;

	return true;
}