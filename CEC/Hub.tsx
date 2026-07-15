import { Suspense, lazy, useState, type FC } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
} from 'react-router-dom';
import CrosshairCursor from './ships/USG_Ishimura/crew/components/CrosshairCursor';
import BlinkingAsciiDots from './ASCII_BG';

const Miners = lazy(
    () => import('./ships/USG_Ishimura/crew/components/Miners'),
);
const Engineers = lazy(
    () => import('./ships/USG_Ishimura/crew/components/Engineers'),
);
const Scientists = lazy(
    () => import('./ships/USG_Ishimura/crew/components/Scientists'),
);
const RotationGraph = lazy(
    () => import('./ships/USG_Ishimura/crew/components/RotationGraph'),
);

const RouteFallback = () => (
    <p
        className="loading"
        style={{
            padding: 24,
            textAlign: 'center',
        }}>
        Loading module…
    </p>
);

const Hub: FC = () => {
    const [isRaw, setIsRaw] = useState(false);

    const toggleRaw = () => {
        setIsRaw(prevState => !prevState);
    };
    return (
        <Router>
            <CrosshairCursor />
            <div id="hub" style={{ position: 'relative', minHeight: '100vh' }}>
                <BlinkingAsciiDots
                    backgroundColor="#0d0d1b"
                    textColor="240, 240, 240"
                    density={1.2}
                    animationSpeed={0.5}
                    removeWaveLine={true}
                />

                <div
                    className="crew"
                    style={{ position: 'relative', zIndex: 10 }}>
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
                                    <Link to="/engineers">Engineers ⚙︎</Link>
                                </button>
                            </li>
                            <li className="nav-list__item">
                                <button className="nav-list__btn">
                                    <Link to="/scientists">Scientists ⚗︎</Link>
                                </button>
                            </li>
                            <li className="nav-list__item">
                                <button className="nav-list__btn">
                                    <Link to="/rotations">Rotations ⇄</Link>
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div className="routes">
                        <Suspense fallback={<RouteFallback />}>
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/miners" replace />}
                                />
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
                                <Route
                                    path="/rotations"
                                    element={<RotationGraph />}
                                />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default Hub;
