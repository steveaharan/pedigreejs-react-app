/**
/* © 2024 University of Cambridge. All rights reserved.  
**/
import React from 'react';
import { pedigreejs, pedigreejs_zooming, pedigreejs_pedcache } from "./pedigreejs.es.v3.0.0-rc8";


export class PedigreeJS extends React.Component {

	constructor() {
	  super();
	  const w = window.innerWidth;
	  const h = window.innerHeight;
	  this.opts = {
		'targetDiv': 'pedigreejs',
		'btn_target': 'pedigree_history',
		'width': (w > 600 ? 500: w - 50),
		'height': h/2,
		'symbol_size': 30,
		'font_size': '.75em',
		'edit': false,
		'zoomIn': .5,
		'zoomOut': 1.5,
		'zoomSrc':  ['wheel', 'button'] ,
		'labels': [['age', 'yob']],
		'diseases': [	{'type': 'breast_cancer', 'colour': '#F68F35'},
						{'type': 'breast_cancer2', 'colour': 'pink'},
						{'type': 'ovarian_cancer', 'colour': '#4DAA4D'},
						{'type': 'pancreatic_cancer', 'colour': '#4289BA'},
						{'type': 'prostate_cancer', 'colour': '#D5494A'}],
		'DEBUG': false};
	}

	componentDidMount() {
		showPedigree(this.opts);
	}

	render() {
	    const opts = this.opts;
		let local_dataset = pedigreejs_pedcache.current(opts);
		if (local_dataset !== undefined && local_dataset !== null) {
			opts.dataset = local_dataset;
		} else {
			opts.dataset = [
				{"name": "m11", "sex": "M", "top_level": true},
				{"name": "f11", "display_name": "Jane",  "sex": "F", "status": 1, "top_level": true, "breast_cancer_diagnosis_age":67, "ovarian_cancer_diagnosis_age":63},
				{"name": "m12", "sex": "M", "top_level": true},
				{"name": "f12", "sex": "F", "top_level": true, "breast_cancer_diagnosis_age":55},
				{"name": "m21", "sex": "M", "mother": "f11", "father": "m11", "age": 56},
				{"name": "f21", "sex": "F", "mother": "f12", "father": "m12", "breast_cancer_diagnosis_age":55, "breast_cancer2_diagnosis_age": 60, "ovarian_cancer_diagnosis_age":58, "age": 63},
				{"name": "ch1", "display_name": "Ana", "sex": "F", "mother": "f21", "father": "m21", "proband": true, "age": 25, "yob": 1996}
			];
		}

		return (
			<>
				<div id="pedigree_history" className="p-2"></div>
				<div key="tree" id="pedigree"></div>
			</>
	    )
	}
}

/** Show pedigreejs **/
const showPedigree = (opts) => {
	const p = document.getElementById("pedigreejs");
	const ped = document.getElementById("pedigree");
	if(!p && ped){
		const p = document.createElement('div');
		p.id = 'pedigreejs';
		ped.appendChild(p); 
		pedigreejs_load(opts);
	}
	const refresh = document.getElementsByClassName("fa-refresh");
	if(refresh) refresh[0].style.display = "none";
}

const pedigreejs_load = (opts) => {
	try {
		pedigreejs.rebuild(opts);
		pedigreejs_zooming.scale_to_fit(opts);
	} catch(e) {
		let msg;
		if (typeof e === "string") {
			msg = e.toUpperCase();
		} else if (e instanceof Error) {
			msg = e.message;
		}
		console.error("PedigreeJS ::: "+msg, e);
	}
};
