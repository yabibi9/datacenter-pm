// ChangeOrderForm.js (Enhanced)
import React, { useState } from 'react';

function ChangeOrderForm({ onSubmit }) {
  const [formState, setFormState] = useState({ id: '', description: '', amount: '', status: 'Pending' });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    setFormState({ id: '', description: '', amount: '', status: 'Pending' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <input type="text" name="id" placeholder="Change Order ID" onChange={handleChange} required />
      </div>
      <div className="form-group">
        <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
      </div>
      <div className="form-group">
        <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
      </div>
      <button type="submit" className="submit-button">Submit Change Order</button>
    </form>
  );
}

export default ChangeOrderForm;
