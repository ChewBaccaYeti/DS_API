import renderMiners from './ships/USG_Ishimura/crew/scripts/helpers/renderMiners.js';
import renderEngineers from './ships/USG_Ishimura/crew/scripts/helpers/renderEngineers.js';
import renderScientists from './ships/USG_Ishimura/crew/scripts/helpers/renderScientists.js';

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