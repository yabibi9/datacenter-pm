import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Correct component imports
import ThreeDModelViewer from './components/ThreeDModelViewer';
import TaskSummary from './components/TaskSummary';
import FinancialManagement from './pages/FinancialManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import DocumentManagement from './pages/DocumentManagement';
import ProjectOverview from './components/ProjectOverview';
import ResourceAllocation from './components/ResourceAllocation';
import SubcontractorTracker from './components/SubcontractorTracker';

function App() {
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
              <li><Link to="/tracker">Subcontractor Tracker</Link></li>
              <li><Link to="/3d-model-viewer">3D Model Viewer</Link></li>
              <li><Link to="/resource-allocation">Resource Allocation</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ProjectOverview />} />
            <Route path="/tasks" element={<TaskSummary />} />
            <Route path="/financials" element={<FinancialManagement />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/tracker" element={<SubcontractorTracker />} />
            <Route path="/3d-model-viewer" element={<ThreeDModelViewer />} />
            <Route path="/resource-allocation" element={<ResourceAllocation />} />
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
