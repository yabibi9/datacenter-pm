import React, { useState } from 'react';

function DocumentManagement() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { label: 'RFIs', value: 'rfi' },
    { label: 'Submittals', value: 'submittals' },
    { label: 'Contracts', value: 'contracts' },
    { label: 'Close-out Documents', value: 'closeout' },
  ];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
    },
    heading: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    dropdownContainer: {
      marginBottom: '15px',
    },
    documentSection: {
      marginTop: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#fff',
    },
    button: {
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Document Management</h1>

      <div style={styles.dropdownContainer}>
        <label htmlFor="category-select">Select Document Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">-- Choose a Category --</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div style={styles.documentSection}>
          <h2>{categories.find((c) => c.value === selectedCategory).label}</h2>
          <p>Upload, track, and manage {selectedCategory} documents here.</p>
          <button style={styles.button}>Upload Document</button>
        </div>
      )}
    </div>
  );
}

export default DocumentManagement;
