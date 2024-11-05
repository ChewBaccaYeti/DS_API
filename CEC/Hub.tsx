import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Miners from './ships/USG_Ishimura/crew/components/Miners';
import Engineers from './ships/USG_Ishimura/crew/components/Engineers';
import Scientists from './ships/USG_Ishimura/crew/components/Scientists';

const Hub: React.FC = () => {
    return (
        <Router>
            <div id='hub'>
                <div className='crew'>
                    <h1>Concordance Extraction Corporation</h1>
                    <nav className='navigation'>
                        <ul className='nav-list'>
                            <li className='nav-list__item'>
                                <button className='nav-list__btn'><Link to="/miners">Miners ⚒</Link></button>
                            </li>
                            <li className='nav-list__item'>
                                <button className='nav-list__btn'><Link to="/engineers">Engineers ⚙️</Link></button>
                            </li>
                            <li className='nav-list__item'>
                                <button className='nav-list__btn'><Link to="/scientists">Scientists 🔬</Link></button>
                            </li>
                        </ul>
                    </nav>
                    <div className='routes'>
                        <Routes>
                            <Route path="/miners" element={<Miners />} />
                            <Route path="/engineers" element={<Engineers />} />
                            <Route path="/scientists" element={<Scientists />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default Hub;