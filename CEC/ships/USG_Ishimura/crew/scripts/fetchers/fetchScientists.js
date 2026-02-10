export default async function fetchScientists() {
    try {
        const res = await fetch('/api/scientists');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const scientists = await res.json();
        return scientists;
    } catch (err) {
        console.error('Failed to fetch scientists:', err);
        return [];
    }
}
