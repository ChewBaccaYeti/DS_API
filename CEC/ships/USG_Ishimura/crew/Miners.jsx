import React, { useEffect, useState } from 'react';
import renderMiners from './scripts/helpers/renderMiners';
import {
    renderCertifications,
    renderEquipment,
} from './scripts/helpers/cert_eq.js';

function Miners() {
    const [miners, setMiners] = useState([]);

    useEffect(() => {
        renderMiners().then(data => setMiners(data));
    }, []);

    return (
        <div id="miners">
            <h2>Miners ⚒</h2>
            {miners.length > 0 ? (
                miners.map(miner => (
                    <div key={miner.id} className="miner">
                        <h2>{miner.name}</h2>
                        <ul>
                            <li>
                                <p>
                                    <strong>Role:</strong> {miner.role.name} (
                                    {miner.role.symbol})
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Species:</strong> {miner.species}
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Citizenship:</strong>{' '}
                                    {miner.citizenship}
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Rank:</strong> {miner.rank}
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Directive:</strong>{' '}
                                    {miner.directive}
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Experience:</strong>{' '}
                                    {miner.experience.years} years
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Skills:</strong>{' '}
                                    {miner.experience.skills.join(', ')}
                                </p>
                            </li>
                        </ul>
                        <p>
                            <strong>Certifications:</strong>
                        </p>
                        <ul>
                            <li>
                                {renderCertifications(miner.certifications)}
                            </li>
                        </ul>
                        <p>
                            <strong>Equipment:</strong>
                        </p>
                        <ul>
                            <li>{renderEquipment(miner.equipment)}</li>
                        </ul>
                    </div>
                ))
            ) : (
                <p>Loading Miners ⚒...</p>
            )}
        </div>
    );
}

export default Miners;
