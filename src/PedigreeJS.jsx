/**
/* © 2024 University of Cambridge. All rights reserved.  
**/
import React from 'react';
import { pedigreejs, pedigreejs_zooming, pedigreejs_pedcache, pedigreejs_io } from "./pedigreejs.es.v3.0.0-rc8";


// Person class to represent individuals in the pedigree
class Person {
	constructor({
		id,
		name,
		sex,
		isTarget = false,
		fatherId = null,
		motherId = null,
		age = null,
		yearOfBirth = null,
		isDead = false,
		isMonozygoticTwin = false,
		isDizygoticTwin = false,
		diseases = {},
		geneticTests = {},
		isAshkenazi = false
	}) {
		this.id = id;
		this.name = name;
		this.sex = sex; // 'M', 'F', or 'U'
		this.isTarget = isTarget;
		this.fatherId = fatherId;
		this.motherId = motherId;
		this.age = age;
		this.yearOfBirth = yearOfBirth;
		this.isDead = isDead;
		this.isMonozygoticTwin = isMonozygoticTwin;
		this.isDizygoticTwin = isDizygoticTwin;
		this.diseases = diseases; // { breast_cancer: 55, prostate_cancer: 71, etc. }
		this.geneticTests = geneticTests; // { BRCA1: 'N', BRCA2: 'P', etc. }
		this.isAshkenazi = isAshkenazi;
	}

	// Convert to CanRisk format for PedigreeJS
	toCanRiskFormat(familyId = 'XFAM') {
		const data = {
			familyId: familyId,
			target: this.isTarget ? 1 : 0,
			nameField: 0, // Name field (not used)
			name: this.name,
			fatherId: this.fatherId || 0,
			motherId: this.motherId || 0,
			sex: this.sex,
			mzTwin: this.isMonozygoticTwin ? 1 : 0,
			dead: this.isDead ? 1 : 0,
			age: this.age || 0,
			yob: this.yearOfBirth || 0,
			bc1: this.diseases.breast_cancer || 0,
			bc2: this.diseases.breast_cancer2 || 0,
			oc: this.diseases.ovarian_cancer || 0,
			pro: this.diseases.prostate_cancer || 0,
			pan: this.diseases.pancreatic_cancer || 0,
			ashkn: this.isAshkenazi ? 1 : 0,
			brca1: this.formatGeneticTest('BRCA1'),
			brca2: this.formatGeneticTest('BRCA2'),
			palb2: this.formatGeneticTest('PALB2'),
			atm: this.formatGeneticTest('ATM'),
			chek2: this.formatGeneticTest('CHEK2'),
			bard1: this.formatGeneticTest('BARD1'),
			rad51d: this.formatGeneticTest('RAD51D'),
			rad51c: this.formatGeneticTest('RAD51C'),
			brip1: this.formatGeneticTest('BRIP1'),
			pathology: '0:0:0:0:0' // Pathology results (ER:PR:HER2:CK14:CK56)
		};
		
		return [
			data.familyId,
			data.target,
			data.nameField,
			data.name,
			data.fatherId,
			data.motherId,
			data.sex,
			data.mzTwin,
			data.dead,
			data.age,
			data.yob,
			data.bc1,
			data.bc2,
			data.oc,
			data.pro,
			data.pan,
			data.ashkn,
			data.brca1,
			data.brca2,
			data.palb2,
			data.atm,
			data.chek2,
			data.bard1,
			data.rad51d,
			data.rad51c,
			data.brip1,
			data.pathology
		].join('\t');
	}

	formatGeneticTest(testName) {
		const result = this.geneticTests[testName];
		if (!result) return '0:0';
		
		switch(result.toUpperCase()) {
			case 'P': return '1:0'; // Positive
			case 'N': return '0:1'; // Negative
			default: return '0:0';  // Unknown
		}
	}
}

// [
//   {
//     "famid": "XFAM",
//     "display_name": "0",
//     "name": "parent3",
//     "sex": "F",
//     "status": "0",
//     "father": null,
//     "mother": null,
//     "age": "55",
//     "breast_cancer_diagnosis_age": "53",
//     "level": 2,
//     "noparents": true
//   },
//   {
//     "famid": "XFAM",
//     "display_name": "0",
//     "name": "parent4",
//     "sex": "M",
//     "status": "0",
//     "age": "60",
//     "level": 2,
//     "noparents": true,
//     "mother": null,
//     "father": null
//   },
//   {
//     "famid": "XFAM",
//     "display_name": "1",
//     "name": "child7",
//     "sex": "F",
//     "status": "0",
//     "father": "parent4",
//     "mother": "parent3",
//     "age": "25",
//     "yob": "2000"
//   }
// ]


const createFamilyData = () => {
	return [
	
		new Person({
			id: 'parent3',
			name: 'parent3',
			sex: 'F',
			age: 55,
			diseases: { breast_cancer: 53 }
		}),
		new Person({
			id: 'parent4',
			name: 'parent4',
			sex: 'M',
			age: 60
		}),
		new Person({
			id: 'child7',
			name: 'child7',
			sex: 'F',
			age: 25,
			yearOfBirth: 2000,
			fatherId: 'parent4',
			motherId: 'parent3',
			isTarget: true
		}),
	];
};

// Family data using Person class
// const createFamilyData = () => {
// 	return [
// 		new Person({
// 			id: 'grandma',
// 			name: 'grandma',
// 			sex: 'F',
// 			age: 85,
// 			yearOfBirth: 1933,
// 			isDead: true,
// 			diseases: { breast_cancer: 55 }
// 		}),
// 		new Person({
// 			id: 'grandpa',
// 			name: 'grandpa',
// 			sex: 'M',
// 			age: 88,
// 			yearOfBirth: 1930,
// 			isDead: true,
// 			diseases: { prostate_cancer: 71 }
// 		}),
// 		new Person({
// 			id: 'parent1',
// 			name: 'parent1',
// 			sex: 'F',
// 			age: 50
// 		}),
// 		new Person({
// 			id: 'parent2',
// 			name: 'parent2',
// 			sex: 'M',
// 			age: 60,
// 			fatherId: 'grandpa',
// 			motherId: 'grandma'
// 		}),
// 		new Person({
// 			id: 'parent3',
// 			name: 'parent3',
// 			sex: 'F',
// 			age: 55,
// 			fatherId: 'grandpa',
// 			motherId: 'grandma',
// 			diseases: { breast_cancer: 53 }
// 		}),
// 		new Person({
// 			id: 'parent4',
// 			name: 'parent4',
// 			sex: 'M',
// 			age: 60
// 		}),
// 		new Person({
// 			id: 'child1',
// 			name: 'child1',
// 			sex: 'F',
// 			age: 40,
// 			fatherId: 'parent2',
// 			motherId: 'parent1',
// 			diseases: { breast_cancer: 40 }
// 		}),
// 		new Person({
// 			id: 'child2',
// 			name: 'child2',
// 			sex: 'F',
// 			age: 38,
// 			fatherId: 'parent2',
// 			motherId: 'parent1'
// 		}),
// 		new Person({
// 			id: 'child3',
// 			name: 'child3',
// 			sex: 'F',
// 			age: 36,
// 			fatherId: 'parent2',
// 			motherId: 'parent1'
// 		}),
// 		new Person({
// 			id: 'child4',
// 			name: 'child4',
// 			sex: 'M',
// 			age: 36,
// 			fatherId: 'parent2',
// 			motherId: 'parent1'
// 		}),
// 		new Person({
// 			id: 'child5',
// 			name: 'child5',
// 			sex: 'F',
// 			age: 36,
// 			fatherId: 'parent2',
// 			motherId: 'parent1'
// 		}),
// 		new Person({
// 			id: 'child6',
// 			name: 'child6',
// 			sex: 'M',
// 			age: 36,
// 			fatherId: 'parent2',
// 			motherId: 'parent1'
// 		}),
// 		new Person({
// 			id: 'child7',
// 			name: 'child7',
// 			sex: 'F',
// 			age: 25,
// 			yearOfBirth: 2000,
// 			fatherId: 'parent4',
// 			motherId: 'parent3',
// 			isTarget: true
// 		}),
// 		new Person({
// 			id: 'child8',
// 			name: 'child8',
// 			sex: 'F',
// 			age: 38,
// 			fatherId: 'parent4',
// 			motherId: 'parent3'
// 		}),
// 		new Person({
// 			id: 'child9',
// 			name: 'child9',
// 			sex: 'F',
// 			age: 23,
// 			fatherId: 'parent4',
// 			motherId: 'parent3'
// 		}),
// 		new Person({
// 			id: 'child10',
// 			name: 'child10',
// 			sex: 'M',
// 			age: 35,
// 			fatherId: 'parent2',
// 			motherId: 'parent1'
// 		}),
// 		new Person({
// 			id: 'child11',
// 			name: 'child11',
// 			sex: 'F',
// 			age: 28,
// 			fatherId: 'parent4',
// 			motherId: 'parent3'
// 		}),
// 		new Person({
// 			id: 'child12',
// 			name: 'child12',
// 			sex: 'M',
// 			age: 0,
// 			fatherId: 'child10',
// 			motherId: 'child11'
// 		}),
// 		new Person({
// 			id: 'child13',
// 			name: 'child13',
// 			sex: 'F',
// 			age: 0,
// 			fatherId: 'child10',
// 			motherId: 'child11'
// 		}),
// 		new Person({
// 			id: 'child14',
// 			name: 'child14',
// 			sex: 'M',
// 			age: 0,
// 			fatherId: 'child10',
// 			motherId: 'child11'
// 		}),
// 		new Person({
// 			id: 'child15',
// 			name: 'child15',
// 			sex: 'F',
// 			age: 0,
// 			fatherId: 'child10',
// 			motherId: 'child11'
// 		})
// 	];
// };

// CanRisk format handler class
class CanRiskFormatter {
	static version = '3.0';
	
	static fields = [
		'FamID', 'Name', 'Target', 'IndivID', 'FathID', 'MothID', 'Sex', 'MZtwin', 'Dead', 'Age', 'Yob',
		'BC1', 'BC2', 'OC', 'PRO', 'PAN', 'Ashkn',
		'BRCA1', 'BRCA2', 'PALB2', 'ATM', 'CHEK2', 'BARD1', 'RAD51D', 'RAD51C', 'BRIP1',
		'ER:PR:HER2:CK14:CK56'
	];
	
	static generateHeader() {
		return [
			`##CanRisk ${this.version}`,
			`##${this.fields.join('\t')}`
		];
	}
	
	static formatFamilyData(familyData) {
		const header = this.generateHeader();
		const dataRows = familyData.map(person => person.toCanRiskFormat());
		return header.concat(dataRows).join('\n');
	}
	
	static getFieldNames() {
		return this.fields;
	}
	
	static getFieldCount() {
		return this.fields.length;
	}
}

// Convert family data to CanRisk format
const generateCanRiskData = (familyData) => {
	return CanRiskFormatter.formatFamilyData(familyData);
};

export class PedigreeJS extends React.Component {

	constructor() {
	  super();
	  const w = window.innerWidth;
	  const h = window.innerHeight;
	  this.opts = {
		'targetDiv': 'pedigreejs',
		'btn_target': 'pedigree_history',
		'width': (w > 1800 ? 1700: w - 50),
		'height': h*0.9,
		'symbol_size': 30,
		'font_size': '.75em',
		'edit': true,
		'showWidgets': true,
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
		// Ensure jQuery is available and wait for it to be loaded
		const checkJQuery = () => {
			if (typeof window.$ !== 'undefined' && typeof window.$.fn.dialog !== 'undefined') {
				showPedigree(this.opts);
			} else {
				setTimeout(checkJQuery, 100);
			}
		};
		checkJQuery();
	}

	render() {
	    const opts = this.opts;
		let local_dataset = pedigreejs_pedcache.current(opts);
		if (local_dataset !== undefined && local_dataset !== null) {
			opts.dataset = local_dataset;
		} else {
			// Create family data using Person class
			const familyData = createFamilyData();
			const generatedCanRiskData = generateCanRiskData(familyData);
			pedigreejs_io.load_data(generatedCanRiskData, opts);
		}

		return (
			<>
				<div id="pedigree_history" className="p-2"></div>
				<div key="tree" id="pedigree"></div>
				{/* Required for edit functionality */}
				<div id="node_properties" title="Edit Details" style={{display: 'none'}}></div>
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
