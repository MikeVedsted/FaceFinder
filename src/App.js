import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
 apiKey: process.env.REACT_APP_CLARIFY_API_KEY
});

class App extends Component {
	constructor(){
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {}
		}
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

	render() {
		return (
	    <div className="App">
	    	<Navigation />
	    	<Logo />
	    	<Rank />
	    	<ImageLinkForm 
	    		onInputChange={this.onInputChange} 
	    		onButtonSubmit={this.onButtonSubmit}/>
    		<FaceRecognition 
    			imageUrl={this.state.imageUrl} 
    			box={this.state.box}/>
	    </div>
  	);
	}
}
  
export default App;