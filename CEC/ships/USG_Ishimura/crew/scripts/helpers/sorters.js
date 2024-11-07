import React from 'react';

export const sortByRank = (crew, sortRank) => {
    return [...crew].sort((a, b) =>
        sortRank === 'asc' ? a.rank - b.rank : b.rank - a.rank,
    );
};

export const sortByExp = (crew, sortExp) => {
    return [...crew].sort((a, b) => {
        const experienceA = parseInt(a.experience.years, 10);
        const experienceB = parseInt(b.experience.years, 10);
        return sortExp === 'asc'
            ? experienceA - experienceB
            : experienceB - experienceA;
    });
};

export function SortButtons({ sortRank, sortExp, onSortByRank, onSortByExp }) {
    return (
        <div className="sorters">
            <button className="btn-sort" onClick={onSortByRank}>
                Sort by Rank ({sortRank === 'asc' ? 'Ascending' : 'Descending'})
            </button>
            <button className="btn-sort" onClick={onSortByExp}>
                Sort by Experience (
                {sortExp === 'asc' ? 'Ascending' : 'Descending'})
            </button>
        </div>
    );
}
