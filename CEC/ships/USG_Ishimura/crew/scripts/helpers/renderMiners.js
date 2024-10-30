export default async function renderMiners() {
    try {
        const res = await fetch('http://localhost:3842/miners');
        const miners = await res.json();
        return miners;
    } catch (err) {
        console.error('Failed to fetch miners:', err);
        return [];
    }
};