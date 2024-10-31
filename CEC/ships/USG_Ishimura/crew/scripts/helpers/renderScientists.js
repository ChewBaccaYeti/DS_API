import { renderCertifications, renderEquipment } from './cert_eq.js';

export default function renderScientists() {
    fetch('http://localhost:3842/scientists')
        .then(res => res.json())
        .then(scientists => {
            const demoElement = document.getElementById('demo');
            demoElement.textContent = JSON.stringify(scientists, null, 2);

            const jsonContainer = document.getElementById('json');
            const formatter = new JSONFormatter(scientists, 2);
            jsonContainer.appendChild(formatter.render());

            const scientistsDiv = document.getElementById('scientists');
            if (scientistsDiv) {
                scientistsDiv.innerHTML = '';
                if (scientists && Array.isArray(scientists)) {
                    scientists.forEach(scientist => {
                        const scientistDiv = document.createElement('div');
                        scientistDiv.classList.add('scientist');
                        scientistDiv.innerHTML = `
                        <h2>${scientist.name}</h2>
                        <p><strong>Role:</strong> ${scientist.role.name} (${scientist.role.symbol})</p>
                        <p><strong>Species:</strong> ${scientist.species}</p>
                        <p><strong>Citizenship:</strong> ${scientist.citizenship}</p>
                        <p><strong>Rank:</strong> ${scientist.rank}</p>
                        <p><strong>Directive:</strong> ${scientist.directive}</p>
                        <p><strong>Experience:</strong> ${scientist.experience.years} years</p>
                        <p><strong>Skills:</strong> ${scientist.experience.skills.join(', ')}</p>
                        <p><strong>Certifications:</strong></p>
                        <ul>${renderCertifications(scientist.certifications)}</ul>
                        <p><strong>Equipment:</strong></p>
                        <ul>${renderEquipment(scientist.equipment)}</ul>
                    `;
                        scientistsDiv.appendChild(scientistDiv);
                    });
                }
                console.log('Scientist data:', scientists);
            } else {
                console.error('Container for scientists not found in DOM');
            }
        })
        .catch(err => console.log(err));
};
