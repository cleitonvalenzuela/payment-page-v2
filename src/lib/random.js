export const getRandomCode = (length=12) => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    let code = "";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * caracteres.length);
        code += caracteres[index];
    }

    return code;
}

export const getRandomEmail = (fullname) => {
    if(!fullname) return;
    const domain_list = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];
    const name_parts = fullname
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ");
  
    const first_name = name_parts[0];
    const last_name = name_parts[name_parts.length - 1] || "";
    const middle = name_parts.length > 2 ? name_parts[1] : "";
  
    const random_number = Math.floor(Math.random() * 10000);
    const random_letters = Math.random().toString(36).substring(2, 5); // 3 random letters
    const random_domain = domain_list[Math.floor(Math.random() * domain_list.length)];
  
    const formats = [
        `${first_name}${random_number}${random_letters}`,
        `${first_name}.${last_name}${random_number}`,
        `${first_name}${middle}${random_number}`,
        `${last_name}_${random_letters}${random_number}`,
        `${random_letters}${first_name}${Math.floor(Math.random() * 1000)}`,
        `${first_name.slice(0, 1)}${last_name}${random_number}`,
        `${first_name}${Math.floor(Math.random() * 99)}${last_name.slice(0, 2)}`
    ];
  
    const local_part = formats[Math.floor(Math.random() * formats.length)];
  
    return `${local_part}@${random_domain}`;
}

export const getBrazilianPhoneNumber = () => {
    const area_codes = [
        11, 21, 31, 41, 51, 61, 71, 81, 91,
        19, 27, 32, 47, 62, 85, 95, 98
    ];
  
    const selected_area_code = area_codes[Math.floor(Math.random() * area_codes.length)];
    const base_number = Math.floor(900000000 + Math.random() * 100000000);
  
    const base_str = base_number.toString();
    return `${selected_area_code}${base_str}`;
}