export default async function fetchScientists() {
    try {
        const res = await fetch('http://localhost:3842/scientists');
        const scientists = await res.json();
        return scientists;
    } catch (err) {
        console.error('Failed to fetch scientists:', err);
        return [];
    }
};