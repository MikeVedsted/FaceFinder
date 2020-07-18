import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

function App() {
  return (
    <div className="App">
    	<Navigation />
    	<Logo />
    	<Rank />
    	<ImageLinkForm />
    </div>
  );
}

export default App;
