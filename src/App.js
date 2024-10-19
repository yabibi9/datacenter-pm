import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ThreeDModelViewer from './components/ThreeDModelViewer';
import TaskSummary from './components/TaskSummary';
import FinancialManagement from './pages/FinancialManagement'; 
import ScheduleManagement from './pages/ScheduleManagement'; 
import DocumentManagement from './pages/DocumentManagement'; 
import ProjectOverview from './components/ProjectOverview';
import ResourceAllocation from './components/ResourceAllocation';

function App() {
  console.log('App component is rendering');
  console.log('ProjectOverview import:', ProjectOverview);
  console.log('ResourceAllocation import:', ResourceAllocation);

  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/tasks">Tasks</Link></li>
              <li><Link to="/financials">Financial Management</Link></li>
              <li><Link to="/schedule">Schedule Management</Link></li>
              <li><Link to="/documents">Document Management</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <section id="dashboard">
                  <h1>Project Dashboard</h1>
                  <div className="widget" id="project-overview">
                    <ProjectOverview />
                  </div>
                  <div className="widget" id="model-viewer">
                    <h2>3D Model Viewer</h2>
                    <ThreeDModelViewer />
                  </div>
                  <div className="widget" id="task-summary">
                    <TaskSummary />
                  </div>
                  <div className="widget" id="resource-allocation">
                    <h2>Resource Allocation</h2>
                    {/* Resource allocation content */}
                  </div>
                </section>
              } 
            />
            <Route path="/tasks" element={<TaskSummary />} />
            <Route path="/financials" element={<FinancialManagement />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2024 Data Center PM Software</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;