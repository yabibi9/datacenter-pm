import React, { useState } from 'react';

const ResourceAllocation = () => {
  const [resources, setResources] = useState([
    { id: 1, name: 'Servers', total: 100, allocated: 75 },
    { id: 2, name: 'Network Switches', total: 50, allocated: 30 },
    { id: 3, name: 'Power Units', total: 200, allocated: 150 },
    { id: 4, name: 'Cooling Systems', total: 20, allocated: 15 },
  ]);

  const [newResource, setNewResource] = useState({ name: '', total: 0, allocated: 0 });

  const addResource = () => {
    if (newResource.name && newResource.total > 0) {
      setResources([...resources, { ...newResource, id: resources.length + 1 }]);
      setNewResource({ name: '', total: 0, allocated: 0 });
    }
  };

  const updateAllocation = (id, allocated) => {
    setResources(resources.map(resource =>
      resource.id === id ? { ...resource, allocated: parseInt(allocated) } : resource
    ));
  };

  return (
    <div className="resource-allocation">
      <h2>Resource Allocation</h2>
      <div className="add-resource">
        <input
          type="text"
          placeholder="Resource name"
          value={newResource.name}
          onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total quantity"
          value={newResource.total}
          onChange={(e) => setNewResource({ ...newResource, total: parseInt(e.target.value) })}
        />
        <button onClick={addResource}>Add Resource</button>
      </div>
      <table className="resource-table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Total</th>
            <th>Allocated</th>
            <th>Available</th>
            <th>Utilization</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource.name}</td>
              <td>{resource.total}</td>
              <td>
                <input
                  type="number"
                  value={resource.allocated}
                  onChange={(e) => updateAllocation(resource.id, e.target.value)}
                  max={resource.total}
                />
              </td>
              <td>{resource.total - resource.allocated}</td>
              <td>{Math.round((resource.allocated / resource.total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceAllocation;