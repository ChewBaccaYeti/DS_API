export default async function fetchMiners() {
    try {
        const res = await fetch('/api/miners');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const miners = await res.json();
        return miners;
    } catch (err) {
        console.error('Failed to fetch miners:', err);
        return [];
    }
}
