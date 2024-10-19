import React from 'react';

const ProjectOverview = () => {
  const projectProgress = 65;
  const startDate = '2024-01-01';
  const endDate = '2024-12-31';
  const totalBudget = 10000000;
  const spentBudget = 6500000;

  const calculateDaysRemaining = () => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="project-overview">
      <h2>Project Overview</h2>
      <div className="metric">
        <h3>Project Progress</h3>
        <div className="progress-bar">
          <div className="progress" style={{width: `${projectProgress}%`}}>{projectProgress}%</div>
        </div>
      </div>
      <div className="metric">
        <h3>Timeline</h3>
        <p>Start Date: {startDate}</p>
        <p>End Date: {endDate}</p>
        <p>Days Remaining: {calculateDaysRemaining()}</p>
      </div>
      <div className="metric">
        <h3>Budget Status</h3>
        <p>Total Budget: ${totalBudget.toLocaleString()}</p>
        <p>Spent: ${spentBudget.toLocaleString()}</p>
        <p>Remaining: ${(totalBudget - spentBudget).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProjectOverview;