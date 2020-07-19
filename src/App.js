import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
 apiKey: process.env.REACT_APP_CLARIFY_API_KEY
});

class App extends Component {
	constructor(){ 
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''
			}
		}
	}

	loadUser = (data) => {
		this.setState({user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
	}

	calculateBoxLocation = (data) => {
		const coordinates = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('imageInput');
		const imageWidth = Number(image.width);
		const imageHeight = Number(image.height);
		return {
			leftCol: coordinates.left_col * imageWidth,
			topRow: coordinates.top_row * imageHeight,
			rightCol: imageWidth - (coordinates.right_col * imageWidth),
			bottomRow: imageHeight - (coordinates.bottom_row * imageHeight)
		}
	}

	overlayBox = (box) => {
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value}); 
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => this.overlayBox(this.calculateBoxLocation(response)))
			.catch(err => console.log(err)
    );
	}

	onRouteChange = (route) => {
		 if(route === 'signout') {
		 	this.setState({isSignedIn: false})
		 } else if (route === 'home') {
		 	this.setState({isSignedIn: 'true'})
		 }
		 this.setState({route: route});
	}

	render() {
		const {isSignedIn, imageUrl, route, box} = this.state;
		return (
	    <div className="App">
	    	<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
	    	{ route === 'home' 
	    	? <div> 
	    		<Logo /> 
		    	<Rank />
		    	<ImageLinkForm 
		    		onInputChange={this.onInputChange} 
		    		onButtonSubmit={this.onButtonSubmit}/>
	    		<FaceRecognition 
	    			imageUrl={imageUrl} 
	    			box={box}/>
			</div>
	    	: ( 
	    		this.state.route === 'signin' 
	    		? <Signin onRouteChange={this.onRouteChange}/>
	    		: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    		)}
	    </div>
  	);
	}
}
  
export default App;