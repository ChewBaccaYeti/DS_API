import { renderCertifications, renderEquipment } from './cert_eq.js';

export default function renderMiners() {
    fetch('http://localhost:3842/miners')
        .then(res => res.json())
        .then(miners => {
            const demoElement = document.getElementById('demo');
            demoElement.textContent = JSON.stringify(miners, null, 2);

            const jsonContainer = document.getElementById('json');
            const formatter = new JSONFormatter(miners, 2);
            jsonContainer.appendChild(formatter.render());

            const minersDiv = document.getElementById('miners');
            if (minersDiv) {
                minersDiv.innerHTML = '';
                if (miners && Array.isArray(miners)) {
                    miners.forEach(miner => {
                        const minerDiv = document.createElement('div');
                        minerDiv.classList.add('miner');
                        minerDiv.innerHTML = `
                        <h2>${miner.name}</h2>
                        <p><strong>Role:</strong> ${miner.role.name} (${miner.role.symbol})</p>
                        <p><strong>Species:</strong> ${miner.species}</p>
                        <p><strong>Citizenship:</strong> ${miner.citizenship}</p>
                        <p><strong>Rank:</strong> ${miner.rank}</p>
                        <p><strong>Directive:</strong> ${miner.directive}</p>
                        <p><strong>Experience:</strong> ${miner.experience.years} years</p>
                        <p><strong>Skills:</strong> ${miner.experience.skills.join(', ')}</p>
                        <p><strong>Certifications:</strong></p>
                        <ul>${renderCertifications(miner.certifications)}</ul>
                        <p><strong>Equipment:</strong></p>
                        <ul>${renderEquipment(miner.equipment)}</ul>
                    `;
                        minersDiv.appendChild(minerDiv);
                    });
                }
                console.log('Miners data:', miners);
            } else {
                console.error('Container for miners not found in DOM');
            }
        })
        .catch(err => console.log(err));
};