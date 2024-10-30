import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import renderMiners from '../scripts/helpers/renderMiners.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';

function Miners() {
    const [miners, setMiners] = useState([]);

    useEffect(() => {
        renderMiners().then(data => setMiners(data));
    }, []);

    return (
        <div id="miners">
            <h2>Welcome to Mining Deck ⚒</h2>
            {miners.length > 0 ? (
                miners.map(miner => (
                    <div key={miner.id} className="miner">
                        <h3>{miner.name}</h3>
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
                        <ul
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    renderCertifications(miner.certifications),
                                ),
                            }}
                        />
                        <h4>Equipment:</h4>
                        <ul
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    renderEquipment(miner.equipment),
                                ),
                            }}
                        />
                    </div>
                ))
            ) : (
                <p>Loading Miners ⚒...</p>
            )}
        </div>
    );
}

export default Miners;
