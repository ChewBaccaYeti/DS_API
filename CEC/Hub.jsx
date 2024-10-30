import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Miners from './ships/USG_Ishimura/crew/Miners';
// import Engineers from './ships/USG_Ishimura/crew/Engineers';
// import Scientists from './ships/USG_Ishimura/crew/Scientists';

function App() {
    return (
        <Router>
            <div>
                <h1>Concordance Extraction Corporation</h1>
                <nav>
                    <Link to="/miners">Miners ⚒</Link>
                    {/* <Link to="/engineers">Engineers ⚙️</Link>
                    <Link to="/scientists">Scientists 🔬</Link> */}
                </nav>
                <Routes>
                    <Route path="/miners" element={<Miners />} />
                    {/* <Route path="/engineers" element={<Engineers />} />
                    <Route path="/scientists" element={<Scientists />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
