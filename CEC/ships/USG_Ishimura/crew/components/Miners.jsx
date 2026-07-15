import CrewComponent from './CrewComponent';

function Miners({ isRaw }) {
    return (
        <CrewComponent
            isRaw={isRaw}
            role="miners"
            title="Mining Deck"
            crewType="miners"
            emoji="⚒︎"
        />
    );
}

export default Miners;
