import renderMiners from './renderMiners.js';
import renderEngineers from './renderEngineers.js';
import renderScientists from './renderScientists.js';

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggle-btn');
    toggleButton.addEventListener('click', toggleSidebar);

    function toggleSidebar() {
        const rawRes = document.getElementById('rawRes');
        rawRes.classList.toggle('open');
    }

    renderMiners();
    renderEngineers();
    renderScientists();
});