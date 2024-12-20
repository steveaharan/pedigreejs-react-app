/**
/* © 2024 University of Cambridge. All rights reserved.  
**/

import { PedigreeJS } from "./PedigreeJS";
import './App.css'

function GitHubButton() {
	return (
		<a className="button" href="https://github.com/CCGE-BOADICEA/pedigreejs-react-app">View on GitHub</a>
	);
}

function App() {
	return (
		<>
		<div className="header">
			<div className="container">
				<span>
					<GitHubButton />
					pedigreejs - React App Example
				</span>
			</div>
		</div>
		
		<PedigreeJS/>
		<p>
		An example deployment of <a href="https://ccge-boadicea.github.io/pedigreejs/">pedigreejs
		</a> using <a href="https://react.dev/">React</a> and <a href="https://vite.dev/">Vite</a>. 
		The pedigreejs ES module bundle file is used (built in the pedigreejs project by 
		running <i>&lsquo;npm run build-es&rsquo;</i>) in the React App.
		</p>
		<p>
		In this example the pedigreejs builder is responsive and changes size for smaller devices.
		</p>
		</>
	)
}

export default App
