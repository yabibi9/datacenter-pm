import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubcontractorTracker = () => {
  const [subcontractors, setSubcontractors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubcontractors, setExpandedSubcontractors] = useState({}); // Manage collapsed/expanded state

  // Fetch subcontractor data when the component mounts
  useEffect(() => {
    axios.get('/api/subcontractors')
      .then(response => setSubcontractors(response.data))
      .catch(error => console.error('Error fetching subcontractors:', error));
  }, []);

  // Calculate progress percentage
  const calculateProgress = (tasks) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Toggle the collapsed/expanded state
  const toggleSubcontractor = (id) => {
    setExpandedSubcontractors((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the state
    }));
  };

  // Handle task completion
  const handleTaskCompletion = (subcontractorId, taskIndex) => {
    axios.post(`/api/subcontractors/${subcontractorId}/tasks/${taskIndex}`)
      .then(response => {
        const updatedSubcontractor = response.data;
        setSubcontractors(prevState =>
          prevState.map(sub =>
            sub.id === subcontractorId ? updatedSubcontractor : sub
          )
        );
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const filteredSubcontractors = subcontractors.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subcontractor-tracker">
      <h2>Subcontractor Tracker</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search subcontractors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Subcontractor List */}
      {filteredSubcontractors.map(subcontractor => (
        <div key={subcontractor.id} className="subcontractor">
          <div
            className="subcontractor-header"
            onClick={() => toggleSubcontractor(subcontractor.id)} // Toggle on click
            style={{ cursor: 'pointer', borderBottom: '1px solid #ccc', padding: '10px 0' }}
          >
            <h3>
              {subcontractor.name} - {subcontractor.scope}
            </h3>
            <p>Progress: {calculateProgress(subcontractor.tasks)}%</p>
          </div>

          {/* Show tasks only if the section is expanded */}
          {expandedSubcontractors[subcontractor.id] && (
            <ul className="subcontractor-tasks" style={{ padding: '10px' }}>
              {subcontractor.tasks.map((task, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskCompletion(subcontractor.id, index)}
                    />
                    {task.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubcontractorTracker;
