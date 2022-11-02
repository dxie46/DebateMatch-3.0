import React, { Component } from 'react';
import UserAuth from './pages/UserAuth';
import Register from './pages/Register';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import NavBar from './navbar/index';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

class App extends Component {

    render() {

        return (

            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/sign-in" element={<UserAuth />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/rankings" element={<Rankings />}/>
                    <Route path="/" element={<Navigate to="/home"/>}/>
                </Routes>
            </BrowserRouter>

        )

    }

}

export default App;