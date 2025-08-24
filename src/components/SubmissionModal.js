import React from 'react';
import './SubmissionModal.css';

const SubmissionModal = ({ isOpen, onClose }) => {

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="submission-modal-overlay" onClick={handleClose}>
      <div className="submission-modal" onClick={e => e.stopPropagation()}>
        <div className="submission-modal-header">
          <h2>Report Missing Vending Machine</h2>
          <button 
            className="submission-modal-close" 
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        
        <form 
          name="vending-machine-submission" 
          method="POST" 
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="submission-form"
          encType="multipart/form-data"
        >
          {/* Netlify form detection */}
          <input type="hidden" name="form-name" value="vending-machine-submission" />
          
          <div className="form-group">
            <label htmlFor="buildingName">Building Name *</label>
            <input
              type="text"
              id="buildingName"
              name="buildingName"
              required
              placeholder="e.g., Perkins Library, LSRC, etc."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="floorLevel">Floor/Level *</label>
            <input
              type="text"
              id="floorLevel"
              name="floorLevel"
              required
              placeholder="e.g., 2nd Floor, Basement, Ground Floor"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="Describe what you found - missing vending machine, new products, etc."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="images">Photos *</label>
            <div className="image-upload-section">
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                required
                className="file-input"
              />
              <p className="upload-hint">Upload 1-5 images (JPEG, PNG, WebP, max 5MB each)</p>
            </div>
          </div>
          
          {/* Honeypot field to prevent spam */}
          <div className="hidden">
            <input name="bot-field" />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;
