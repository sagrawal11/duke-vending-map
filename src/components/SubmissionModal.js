import React, { useState } from 'react';
import './SubmissionModal.css';

const SubmissionModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleClose = () => {
    if (submitSuccess) {
      // Reset form state when closing after success
      setSubmitSuccess(false);
    }
    setSelectedImages([]);
    onClose();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageObjects = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file)
    }));
    setSelectedImages(imageObjects);
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form data
    const formData = new FormData(e.target);
    
    // Submit form
    fetch('/', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        setSubmitSuccess(true);
        setIsSubmitting(false);
      } else {
        throw new Error('Submission failed');
      }
    })
    .catch(error => {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your report. Please try again.');
    });
  };

  if (!isOpen) return null;

  // Show success message
  if (submitSuccess) {
    return (
      <div className="submission-modal-overlay" onClick={handleClose}>
        <div className="submission-modal" onClick={e => e.stopPropagation()}>
          <div className="submission-modal-header">
            <h2>Thank You! 🎉</h2>
            <button 
              className="submission-modal-close" 
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h3>Report Submitted Successfully!</h3>
            <p>Thank you for submitting a report and helping make this guide more accurate for Duke students!</p>
            <button 
              className="submit-button"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        
        <div className="submission-modal-description">
          <p>This app uses crowdsourced data to keep vending machine inventory and locations up to date for all Duke students and staff. By reporting a new machine or inventory change that's not in the app already, you're helping make it more accurate for everyone. Thank you! 🙌</p>
        </div>
        
        <form 
          name="vending-machine-submission" 
          method="POST" 
          onSubmit={handleSubmit}
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
              placeholder="Describe what you found - missing vending machine not on this map, new or changed products, etc."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="images">Photos (pls take individual photos of each vending machine 🙏) *</label>
            <div className="image-upload-section">
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                required
                className="file-input"
                onChange={handleImageChange}
              />
              <p className="upload-hint">Upload 1-5 images (JPEG, PNG, WebP, max 5MB each)</p>
            </div>
            
            {selectedImages.length > 0 && (
              <div className="image-previews">
                {selectedImages.map((image) => (
                  <div key={image.id} className="image-preview-container">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => removeImage(image.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Honeypot field to prevent spam */}
          <div style={{ display: 'none' }}>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;
