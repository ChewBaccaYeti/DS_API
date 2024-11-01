import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import fetchMiners from '../scripts/fetchers/fetchMiners.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';

function Miners() {
    const [miners, setMiners] = useState([]);

    useEffect(() => {
        fetchMiners().then(data => setMiners(data));
    }, []);

    return (
        <div id="miners">
            <h2>Welcome to Mining Deck ⚒</h2>
            <div className="miners-grid">
                {miners.length > 0 ? (
                    miners.map(miner => (
                        <div key={miner.id} className="miner">
                            <h3>{miner.name}</h3>
                            <ul>
                                <li>
                                    <p>
                                        <strong>Role:</strong> {miner.role.name}{' '}
                                        ({miner.role.symbol})
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <strong>Species:</strong>{' '}
                                        {miner.species}
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
                            <h4>Certifications:</h4>
                            <ul
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        renderCertifications(
                                            miner.certifications,
                                        ),
                                    ),
                                }}
                            />
                            <br />
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
                    <p className="loading">Loading Miners ⚒...</p>
                )}
            </div>
        </div>
    );
}

export default Miners;
