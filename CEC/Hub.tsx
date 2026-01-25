import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Miners from './ships/USG_Ishimura/crew/components/Miners';
import Engineers from './ships/USG_Ishimura/crew/components/Engineers';
import Scientists from './ships/USG_Ishimura/crew/components/Scientists';
import BlinkingAsciiDots from '../ASCII_BG';

const Hub: React.FC = () => {
    const [isRaw, setIsRaw] = React.useState(false);

    const toggleRaw = () => {
        setIsRaw(prevState => !prevState);
    };
    return (
        <Router>
            <div id="hub" style={{ position: 'relative', minHeight: '100vh' }}>
                {/* ASCII Background Animation */}
                <BlinkingAsciiDots 
                    backgroundColor="#0d0d1b"
                    textColor="240, 240, 240"
                    density={1.2}
                    animationSpeed={0.5}
                    removeWaveLine={true}
                />
                
                {/* Main Content */}
                <div className="crew" style={{ position: 'relative', zIndex: 10 }}>
                    <h1>Concordance Extraction Corporation</h1>
                    <button className="toggle-raw__btn" onClick={toggleRaw}>
                        {isRaw ? 'Show Styled Data' : 'Show Raw Data'}
                    </button>
                    <nav className="navigation">
                        <ul className="nav-list">
                            <li className="nav-list__item">
                                <button className="nav-list__btn">
                                    <Link to="/miners">Miners ⚒</Link>
                                </button>
                            </li>
                            <li className="nav-list__item">
                                <button className="nav-list__btn">
                                    <Link to="/engineers">Engineers ⚙️</Link>
                                </button>
                            </li>
                            <li className="nav-list__item">
                                <button className="nav-list__btn">
                                    <Link to="/scientists">Scientists 🔬</Link>
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div className="routes">
                        <Routes>
                            <Route
                                path="/miners"
                                element={<Miners isRaw={isRaw} />}
                            />
                            <Route
                                path="/engineers"
                                element={<Engineers isRaw={isRaw} />}
                            />
                            <Route
                                path="/scientists"
                                element={<Scientists isRaw={isRaw} />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default Hub;
