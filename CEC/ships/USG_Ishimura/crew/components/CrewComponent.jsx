import { useCallback, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';
import {
    sortByRank,
    sortByExp,
    SortButtons,
} from '../scripts/helpers/sorters.js';
import { useCrew } from '../hooks/useCrew';
import { CrewSkeleton } from './ui/CrewSkeleton';
import { ErrorState } from './ui/ErrorState';

const ACCENTS = {
    miners: '#ffb03b',
    engineers: '#4dd0e1',
    scientists: '#c8102e',
};

function CrewComponent({ isRaw, role, title, crewType, emoji }) {
    const { data, isLoading, isError, error, refetch, isFetching } = useCrew(
        role,
        { page: 1, limit: 50 },
    );

    const items = data?.items ?? [];
    const accent = ACCENTS[role] ?? '#4dd0e1';

    const [sortRank, setRank] = useState('asc');
    const [sortExp, setExp] = useState('asc');

    const sortedCrew = useMemo(() => {
        let list = items;
        list = sortByRank(list, sortRank);
        list = sortByExp(list, sortExp);
        return list;
    }, [items, sortRank, sortExp]);

    const handleSortByRank = useCallback(() => {
        setRank(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }, []);

    const handleSortByExp = useCallback(() => {
        setExp(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }, []);

    if (isError) {
        return (
            <div id={crewType}>
                <h2>{`Welcome to ${title} ${emoji}`}</h2>
                <ErrorState
                    error={error}
                    onRetry={refetch}
                    accentColor={accent}
                />
            </div>
        );
    }

    const renderCrewMember = member => (
        <div key={member._id || member.id} className={crewType.slice(0, -1)}>
            <h3>{member.name}</h3>
            <ul>
                <li>
                    <p>
                        <strong>Status:</strong>{' '}
                        {member.activeStatus ? 'Active' : 'Deactivated'}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Execution ID:</strong> {member.id}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Rank:</strong> {member.rank}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Role:</strong> {member.role.name} (
                        {member.role.symbol})
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Species:</strong> {member.species}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Citizenship:</strong> {member.citizenship}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Directive:</strong> {member.directive}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Experience:</strong> {member.experience.years}{' '}
                        years
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Skills:</strong>{' '}
                        {member.experience.skills.join(', ')}
                    </p>
                </li>
            </ul>
            <h4>Certifications:</h4>
            <ul
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                        renderCertifications(member.certifications),
                    ),
                }}
            />
            <br />
            <h4>Equipment:</h4>
            <ul
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                        renderEquipment(member.equipment),
                    ),
                }}
            />
        </div>
    );

    return (
        <div id={crewType}>
            <h2>{`Welcome to ${title} ${emoji}`}</h2>
            {isLoading ? (
                <CrewSkeleton count={6} accentColor={accent} />
            ) : isRaw ? (
                <div className="raw-data">
                    {sortedCrew.length > 0 ? (
                        sortedCrew.map((member, index) => (
                            <div key={index} className="raw-data__object">
                                <pre>{JSON.stringify(member, null, 2)}</pre>
                            </div>
                        ))
                    ) : (
                        <p className="loading">{`No ${title} data ${emoji}`}</p>
                    )}
                </div>
            ) : (
                <>
                    <SortButtons
                        sortRank={sortRank}
                        sortExp={sortExp}
                        onSortByRank={handleSortByRank}
                        onSortByExp={handleSortByExp}
                    />
                    <div className={`${crewType}-grid`}>
                        {sortedCrew.length > 0 ? (
                            sortedCrew.map(renderCrewMember)
                        ) : (
                            <p className="loading">{`No ${title} data ${emoji}`}</p>
                        )}
                    </div>
                    {isFetching && (
                        <p
                            className="loading"
                            style={{ marginTop: 12, fontSize: 12 }}>
                            Refreshing telemetry…
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default CrewComponent;
