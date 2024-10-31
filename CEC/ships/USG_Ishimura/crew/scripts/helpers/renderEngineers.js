import { renderCertifications, renderEquipment } from './cert_eq.js';

export default function renderEngineers() {
    fetch('http://localhost:3842/engineers')
        .then(res => res.json())
        .then(engineers => {
            const demoElement = document.getElementById('demo');
            demoElement.textContent = JSON.stringify(engineers, null, 2);

            const jsonContainer = document.getElementById('json');
            const formatter = new JSONFormatter(engineers, 2);
            jsonContainer.appendChild(formatter.render());

            const engineersDiv = document.getElementById('engineers');
            if (engineersDiv) {
                engineersDiv.innerHTML = '';
                if (engineers && Array.isArray(engineers)) {
                    engineers.forEach(engineer => {
                        const engineerDiv = document.createElement('div');
                        engineerDiv.classList.add('engineer');
                        engineerDiv.innerHTML = `
                        <h2>${engineer.name}</h2>
                        <p><strong>Role:</strong> ${engineer.role.name} (${engineer.role.symbol})</p>
                        <p><strong>Species:</strong> ${engineer.species}</p>
                        <p><strong>Citizenship:</strong> ${engineer.citizenship}</p>
                        <p><strong>Rank:</strong> ${engineer.rank}</p>
                        <p><strong>Directive:</strong> ${engineer.directive}</p>
                        <p><strong>Experience:</strong> ${engineer.experience.years} years</p>
                        <p><strong>Skills:</strong> ${engineer.experience.skills.join(', ')}</p>
                        <p><strong>Certifications:</strong></p>
                        <ul>${renderCertifications(engineer.certifications)}</ul>
                        <p><strong>Equipment:</strong></p>
                        <ul>${renderEquipment(engineer.equipment)}</ul>
                    `;
                        engineersDiv.appendChild(engineerDiv);
                    });
                }
                console.log('Engineers data:', engineers);
            } else {
                console.error('Container for engineers not found in DOM');
            }
        })
        .catch(err => console.log(err));
};