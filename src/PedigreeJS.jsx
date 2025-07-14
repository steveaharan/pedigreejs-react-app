/**
/* © 2024 University of Cambridge. All rights reserved.  
**/
import React, { useState } from 'react';
import { pedigreejs, pedigreejs_zooming, pedigreejs_pedcache, pedigreejs_io, pedigreejs_utils } from "./pedigreejs.es.v3.0.0-rc8";
import PersonEditDialog from './PersonEditDialog';


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
		console.log("Creating Person:", id, isTarget, name);
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
			display_name: this.isTarget ? "1" : "0", // Display name shows target status
			target: this.isTarget ? 1 : 0,
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
		console.log("Converting to CanRisk format:", data);
		var rawData = 
		[
			data.familyId,
			data.display_name,
			data.target,
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
			data.pathology,
			// data.proband
		];
		console.log("Raw CanRisk data:", rawData);
		return rawData.join('\t');
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
			// diseases: { breast_cancer: 53 }
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
		console.log("Formatted CanRisk data:", dataRows);
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

export const PedigreeJS = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState(null);
	const [validationError, setValidationError] = useState(null);
	const [rollbackMessage, setRollbackMessage] = useState(null);

	const w = window.innerWidth;
	const h = window.innerHeight;
	const opts = {
		'targetDiv': 'pedigreejs',
		'btn_target': 'pedigree_history',
		'width': (w > 1800 ? 1700: w - 50),
		'height': h*1.0,
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
		'DEBUG': false,
		'onPersonEdit': (person) => {
			setSelectedPerson(person);
			setDialogOpen(true);
		}
	};

	const handleDialogSave = (updatedData) => {
		if (!selectedPerson) return;
		
		try {
			// Clear any previous validation errors
			setValidationError(null);
			
			// Get current dataset and preserve original
			let originalDataset = pedigreejs_pedcache.current(opts);
			if (!originalDataset) {
				setValidationError('Unable to access pedigree data. Please try refreshing the page.');
				return;
			}
			
			// Create a deep copy for testing the changes
			let testDataset = pedigreejs_utils.copy_dataset(originalDataset);
			
			// Find the person in the test dataset by name
			const testPerson = testDataset.find(p => p.name === selectedPerson.data.name);
			if (!testPerson) {
				setValidationError('Unable to find the person in the pedigree data.');
				return;
			}
			
			// Apply changes to the test dataset
			Object.assign(testPerson, updatedData);
			
			// Create a backup of current opts for rollback
			const originalOptsDataset = opts.dataset;
			
			// Set up one-time listener for validation errors
			let errorHandled = false;
			let rollbackCompleted = false;
			
			const validationErrorHandler = (e, opts, error) => {
				if (errorHandled) return; // Prevent duplicate handling
				errorHandled = true;
				console.warn('Rebuild validation error:', error);
				
				// ROLLBACK: Restore original dataset
				if (!rollbackCompleted) {
					rollbackCompleted = true;
					console.log('Rolling back to original dataset due to validation error');
					
					// Restore original dataset in opts
					opts.dataset = originalOptsDataset;
					opts._isRollback = true; // Mark as rollback operation
					
					// Set up rollback success listener
					const rollbackSuccessHandler = () => {
						console.log('Rollback completed successfully');
						$(document).off('rollback_success', rollbackSuccessHandler);
					};
					$(document).on('rollback_success', rollbackSuccessHandler);
					
					// Trigger rebuild with original data (should succeed)
					try {
						// Use setTimeout to avoid recursive event issues
						setTimeout(() => {
							$(document).trigger('rebuild', [opts]);
						}, 50);
					} catch (rollbackError) {
						console.error('Rollback rebuild failed:', rollbackError);
					}
				}
				
				// Show error to user
				setValidationError(getValidationErrorMessage(error));
				
				// Show rollback notification with specific error context
				const errorType = error.message.includes('mother') ? 'parent gender validation' :
								 error.message.includes('father') ? 'parent gender validation' :
								 error.message.includes('missing') ? 'missing relationship' :
								 error.message.includes('unique') ? 'duplicate ID' :
								 'validation';
				setRollbackMessage(`${errorType.charAt(0).toUpperCase() + errorType.slice(1)} error detected. Your changes have been reverted to prevent data corruption. Please correct the error and try again.`);
				setTimeout(() => setRollbackMessage(null), 5000); // Clear after 5 seconds
				
				// Remove the listener after handling
				$(document).off('validation_error', validationErrorHandler);
			};
			
			const successHandler = () => {
				// Clean up listener
				$(document).off('validation_error', validationErrorHandler);
				
				// If no error was handled, consider it successful
				if (!errorHandled && !validationError) {
					console.log('Save successful, closing dialog');
					setSelectedPerson(null);
					setDialogOpen(false);
				}
			};
			
			if (typeof window.$ !== 'undefined') {
				$(document).on('validation_error', validationErrorHandler);
				
				// Apply test dataset to opts for validation
				opts.dataset = testDataset;
				
				// Clear any previous validation errors
				setValidationError('');
				
				// Try to rebuild with test data - errors will be caught by the error handler
				try {
					window.$(document).trigger('rebuild', [opts]);
				} catch (triggerError) {
					// If even the trigger fails, handle it directly
					console.error('Rebuild trigger failed:', triggerError);
					
					// Rollback immediately
					if (!rollbackCompleted) {
						rollbackCompleted = true;
						opts.dataset = originalOptsDataset;
						opts._isRollback = true; // Mark as rollback operation
						setTimeout(() => {
							$(document).trigger('rebuild', [opts]);
						}, 50);
					}
					
					setValidationError(getValidationErrorMessage(triggerError));
					errorHandled = true;
				}
				
				// Wait a bit to see if a validation error occurred
				setTimeout(successHandler, 150);
			} else {
				// Fallback to direct rebuild when jQuery is not available
				try {
					// Apply test dataset to opts for validation
					opts.dataset = testDataset;
					
					pedigreejs.rebuild(opts);
					// If successful, close the dialog
					setSelectedPerson(null);
					setDialogOpen(false);
				} catch (rebuildErr) {
					console.error('Direct rebuild failed:', rebuildErr);
					
					// Rollback on direct rebuild failure
					opts.dataset = originalOptsDataset;
					opts._isRollback = true; // Mark as rollback operation
					try {
						pedigreejs.rebuild(opts);
						console.log('Direct rollback completed');
					} catch (rollbackError) {
						console.error('Direct rollback failed:', rollbackError);
					}
					
					setValidationError(getValidationErrorMessage(rebuildErr));
				}
			}
		} catch (err) {
			// Handle any other errors
			console.warn('Dialog save error:', err);
			setValidationError(getValidationErrorMessage(err));
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedPerson(null);
		setValidationError(null); // Clear validation errors when closing
	};

	// Helper function to provide user-friendly error messages
	const getValidationErrorMessage = (error) => {
		const originalMessage = error.message || error.toString();
		
		// Always preserve the original error details for specificity
		// Just add helpful context and formatting
		
		if (originalMessage.includes('missing from the pedigree')) {
			return `${originalMessage}\n\nThis means a person references a parent who no longer exists in the pedigree. Please check the family relationships and ensure all referenced parents are present.`;
		}
		
		if (originalMessage.includes('mother') && originalMessage.includes('not specified as female')) {
			return `${originalMessage}\n\nTo fix this: Find the person who is marked as a mother and ensure their "Sex" field is set to "F" (Female).`;
		}
		
		if (originalMessage.includes('father') && originalMessage.includes('not specified as male')) {
			return `${originalMessage}\n\nTo fix this: Find the person who is marked as a father and ensure their "Sex" field is set to "M" (Male).`;
		}
		
		if (originalMessage.includes('IndivID') && originalMessage.includes('not unique')) {
			return `${originalMessage}\n\nEach person must have a unique Individual ID. Please change one of the conflicting IDs to a different value.`;
		}
		
		if (originalMessage.includes('Missing parent')) {
			return `${originalMessage}\n\nIn a pedigree, if you specify one parent for a person, you must specify both parents. Either add the missing parent or remove the existing parent reference.`;
		}
		
		if (originalMessage.includes('More than one family found')) {
			return `${originalMessage}\n\nAll people in the pedigree must belong to the same family. Check that family relationships are consistent throughout.`;
		}
		
		if (originalMessage.includes('pedigree') || originalMessage.includes('validation') || originalMessage.includes('invalid')) {
			return `${originalMessage}\n\nPlease review the pedigree data and ensure all relationships and person details are valid.`;
		}
		
		// For any other error, return the original message with general guidance
		return `${originalMessage}\n\nPlease check your pedigree data for any inconsistencies or invalid values.`;
	};

	React.useEffect(() => {
		// Store the edit handler globally so pedigreejs can access it
		window.reactEditHandler = opts.onPersonEdit;
		
		// Add global error handler for validation errors from jQuery triggers
		const handleGlobalError = (e, opts, error) => {
			console.warn('Global validation error caught:', error);
			if (error && (error.message || error.toString()).includes('pedigree')) {
				setValidationError(getValidationErrorMessage(error));
				// If dialog is not open, we might want to show a toast or other notification
				if (!dialogOpen) {
					console.error('Validation error outside of dialog context:', error);
					// Could add a toast notification here in the future
				}
			}
		};
		
		// Listen for validation errors
		if (typeof window.$ !== 'undefined') {
			window.$(document).on('validation_error', handleGlobalError);
		}
		
		// Ensure jQuery is available and wait for it to be loaded
		const checkJQuery = () => {
			if (typeof window.$ !== 'undefined' && typeof window.$.fn.dialog !== 'undefined') {
				showPedigree(opts);
			} else {
				setTimeout(checkJQuery, 100);
			}
		};
		checkJQuery();
		
		// Cleanup
		return () => {
			if (typeof window.$ !== 'undefined') {
				window.$(document).off('validation_error', handleGlobalError);
			}
		};
	}, []);

	const local_dataset = pedigreejs_pedcache.current(opts);
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
			{/* Legacy node properties div - hidden but still needed for some functionality */}
			<div id="node_properties" title="Edit Details" style={{display: 'none'}}></div>
			
			{/* Rollback notification */}
			{rollbackMessage && (
				<div style={{
					position: 'fixed',
					top: '20px',
					right: '20px',
					background: '#fff3cd',
					border: '1px solid #ffeaa7',
					borderRadius: '5px',
					padding: '15px',
					boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
					zIndex: 10000,
					maxWidth: '400px',
					color: '#856404'
				}}>
					<strong>⟲ Changes Reverted:</strong><br/>
					{rollbackMessage}
				</div>
			)}
			
			{/* React Dialog */}
			<PersonEditDialog
				isOpen={dialogOpen}
				onClose={handleDialogClose}
				person={selectedPerson}
				diseases={opts.diseases}
				onSave={handleDialogSave}
				validationError={validationError}
			/>
		</>
	);
};

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
		} else {
			msg = "Unknown error occurred";
		}
		console.error("PedigreeJS load error: " + msg, e);
		
		// Don't re-throw - the rebuild function should have handled displaying the error
		// If no error display was shown, add a fallback
		const targetDiv = opts && opts.targetDiv ? opts.targetDiv : 'pedigree_edit';
		const targetElement = document.getElementById(targetDiv);
		if (targetElement && !targetElement.innerHTML.trim()) {
			targetElement.innerHTML = `
				<div style="padding:20px;color:#721c24;background:#f8d7da;border:1px solid #f5c6cb;margin:10px;border-radius:5px;font-family:Arial,sans-serif;">
					<strong>⚠️ Failed to Load Pedigree:</strong><br>
					<div style="margin-top:8px;">${msg}</div>
				</div>
			`;
		}
	}
};
