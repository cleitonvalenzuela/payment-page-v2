export const BuildURL = (base_path, params) => {
    const search_params = new URLSearchParams();
    
    for (const key in params) {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(v => search_params.append(key, v));
        } else if (value !== undefined && value !== null) {
            search_params.append(key, value);
        }
    }
    
    const query_string = search_params.toString();
    return query_string ? `${base_path}?${query_string}` : base_path;
}