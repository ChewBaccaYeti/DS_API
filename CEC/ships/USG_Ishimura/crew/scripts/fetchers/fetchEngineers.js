export default async function fetchEngineers() {
    try {
        const res = await fetch('http://localhost:3842/engineers');
        const engineers = await res.json();
        return engineers;
    } catch (err) {
        console.error('Failed to fetch engineers:', err);
        return [];
    }
};