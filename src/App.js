import React from 'react';
import ThreeDModelViewer from './components/ThreeDModelViewer';
import TaskSummary from './components/TaskSummary'; // Add this import

function App() {
  return (
    <div className="App">
      <header>
        <nav>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#tasks">Tasks</a></li>
            <li><a href="#resources">Resources</a></li>
            <li><a href="#reports">Reports</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="dashboard">
          <h1>Project Dashboard</h1>
          <div className="widget" id="project-overview">
            <h2>Project Overview</h2>
            {/* Project overview content */}
          </div>
          <div className="widget" id="model-viewer">
            <h2>3D Model Viewer</h2>
            <ThreeDModelViewer />
          </div>
          <div className="widget" id="task-summary">
            <TaskSummary /> {/* Use the TaskSummary component here */}
          </div>
          <div className="widget" id="resource-allocation">
            <h2>Resource Allocation</h2>
            {/* Resource allocation content */}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Data Center PM Software</p>
      </footer>
    </div>
  );
}

export default App;