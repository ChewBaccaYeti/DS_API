export default async function fetchEngineers() {
    try {
        const res = await fetch('/api/engineers');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const engineers = await res.json();
        return engineers;
    } catch (err) {
        console.error('Failed to fetch engineers:', err);
        return [];
    }
}
