import React, { Component } from 'react';
import UserAuth from './pages/UserAuth';
import Register from './pages/Register';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Favorites from './pages/Favorites';
import NavBar from './navbar/index';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { database } from './firebase-config';

class App extends Component {
// element={<Home inputVideos=____ />}
// firestore solution: fetch necessary data here (just videos?) and pass as props below (see example above)
    fetchData = async() => {
        const videosCollectionRef = collection(database, "videos")
        const data: any = await getDocs(videosCollectionRef);
        const videoData = data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
        return videoData;
    }

    render() {

        return (

            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/home" element={<Home inputVideos={this.fetchData()}/>} />
                    <Route path="/sign-in" element={<UserAuth />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/rankings" element={<Rankings inputVideos={this.fetchData()}/>}/>
                    <Route path="/favorites" element={<Favorites />}/>
                    <Route path="/" element={<Navigate to="/home"/>}/>
                </Routes>
            </BrowserRouter>

        )

    }

}

export default App;