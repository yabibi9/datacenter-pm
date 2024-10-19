// PayApplicationForm.js (Enhanced)
import React, { useState } from 'react';

function PayApplicationForm({ onSubmit }) {
  const [formState, setFormState] = useState({ trade: '', month: '', amount: '', status: 'Pending' });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    setFormState({ trade: '', month: '', amount: '', status: 'Pending' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <select name="trade" onChange={handleChange} required>
          <option value="">Select Trade</option>
          <option value="Electrical">Electrical</option>
          <option value="HVAC">HVAC</option>
          <option value="Plumbing">Plumbing</option>
        </select>
      </div>
      <div className="form-group">
        <input type="text" name="month" placeholder="Month" onChange={handleChange} required />
      </div>
      <div className="form-group">
        <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
      </div>
      <button type="submit" className="submit-button">Submit Pay Application</button>
    </form>
  );
}

export default PayApplicationForm;
