const createSlug = (name) =>{
    const trimmedName = name.trim();
    const cleanedName = trimmedName.replace(/[^\w\s]/gi, '');
    const slug = cleanedName.toLowerCase().replace(/\s+/g, '-');
    return slug;
}
module.exports = {createSlug};