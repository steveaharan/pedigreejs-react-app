/**
 * Modern React component for editing person details in the pedigree
 * © 2024 University of Cambridge. All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import './PersonEditDialog.css';

const PersonEditDialog = ({ 
  isOpen, 
  onClose, 
  person, 
  diseases = [], 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    age: '',
    yob: '',
    sex: 'U',
    status: '0',
    adopted_in: false,
    adopted_out: false,
    miscarriage: false,
    stillbirth: false,
    termination: false,
    ...person?.data || {}
  });

  const [diseaseAges, setDiseaseAges] = useState({});

  useEffect(() => {
    if (person?.data) {
      setFormData({
        name: '',
        display_name: '',
        age: '',
        yob: '',
        sex: 'U',
        status: '0',
        adopted_in: false,
        adopted_out: false,
        miscarriage: false,
        stillbirth: false,
        termination: false,
        ...person.data
      });

      // Initialize disease ages
      const ages = {};
      diseases.forEach(disease => {
        const ageKey = `${disease.type}_diagnosis_age`;
        ages[disease.type] = person.data[ageKey] || '';
      });
      setDiseaseAges(ages);
    }
  }, [person, diseases]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiseaseAgeChange = (diseaseType, age) => {
    setDiseaseAges(prev => ({
      ...prev,
      [diseaseType]: age
    }));
  };

  const handleSave = () => {
    // Combine form data with disease ages
    const updatedData = { ...formData };
    
    // Ensure status is a number
    updatedData.status = parseInt(updatedData.status);
    
    // Ensure age and yob are numbers if provided
    if (updatedData.age) {
      updatedData.age = parseInt(updatedData.age);
    }
    if (updatedData.yob) {
      updatedData.yob = parseInt(updatedData.yob);
    }
    
    // Add disease diagnosis ages
    Object.entries(diseaseAges).forEach(([diseaseType, age]) => {
      if (age) {
        updatedData[`${diseaseType}_diagnosis_age`] = parseInt(age);
      }
    });

    onSave(updatedData);
    onClose();
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Edit Person Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="dialog-body">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <label htmlFor="name">Individual ID:</label>
              <input
                type="text"
                id="name"
                value={formData.name || ''}
                onChange={e => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="form-row">
              <label htmlFor="display_name">Display Name:</label>
              <input
                type="text"
                id="display_name"
                value={formData.display_name || ''}
                onChange={e => handleInputChange('display_name', e.target.value)}
                placeholder="Name shown on pedigree"
              />
            </div>

            <div className="form-row">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                min="0"
                max="120"
                value={formData.age || ''}
                onChange={e => handleInputChange('age', e.target.value)}
              />
            </div>

            <div className="form-row">
              <label htmlFor="yob">Year of Birth:</label>
              <input
                type="number"
                id="yob"
                min="1900"
                max="2050"
                value={formData.yob || ''}
                onChange={e => handleInputChange('yob', e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Sex:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sex"
                    value="M"
                    checked={formData.sex === 'M'}
                    onChange={e => handleInputChange('sex', e.target.value)}
                  />
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sex"
                    value="F"
                    checked={formData.sex === 'F'}
                    onChange={e => handleInputChange('sex', e.target.value)}
                  />
                  Female
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sex"
                    value="U"
                    checked={formData.sex === 'U'}
                    onChange={e => handleInputChange('sex', e.target.value)}
                  />
                  Unknown
                </label>
              </div>
            </div>

            <div className="form-row">
              <label>Status:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="0"
                    checked={formData.status === '0' || formData.status === 0}
                    onChange={e => handleInputChange('status', e.target.value)}
                  />
                  Alive
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="1"
                    checked={formData.status === '1' || formData.status === 1}
                    onChange={e => handleInputChange('status', e.target.value)}
                  />
                  Deceased
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Reproduction</h3>
            <div className="checkbox-group">
              {['adopted_in', 'adopted_out', 'miscarriage', 'stillbirth', 'termination'].map(field => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData[field] || false}
                    onChange={e => handleInputChange(field, e.target.checked)}
                  />
                  {capitalizeFirstLetter(field)}
                </label>
              ))}
            </div>
          </div>

          {diseases.length > 0 && (
            <div className="form-section">
              <h3>Age of Diagnosis</h3>
              {diseases.map(disease => (
                <div key={disease.type} className="form-row">
                  <label htmlFor={`disease_${disease.type}`}>
                    {capitalizeFirstLetter(disease.type)}:
                    <span 
                      className="disease-color-indicator"
                      style={{ backgroundColor: disease.colour }}
                    ></span>
                  </label>
                  <input
                    type="number"
                    id={`disease_${disease.type}`}
                    min="0"
                    max="110"
                    value={diseaseAges[disease.type] || ''}
                    onChange={e => handleDiseaseAgeChange(disease.type, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonEditDialog;
