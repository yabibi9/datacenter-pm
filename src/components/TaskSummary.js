import React, { useState } from 'react';

const TaskSummary = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design server room layout', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Order cooling systems', status: 'Pending', priority: 'Medium' },
    { id: 3, title: 'Install network cabling', status: 'Completed', priority: 'High' },
  ]);

  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: tasks.length + 1,
        title: newTask,
        status: 'Pending',
        priority: 'Medium',
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? {...task, status: task.status === 'Completed' ? 'In Progress' : 'Completed'}
        : task
    ));
  };

  return (
    <div className="task-summary">
      <h2>Task Summary</h2>
      <div className="add-task">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.status.toLowerCase().replace(' ', '-')}`}>
            <span className="task-title">{task.title}</span>
            <span className="task-priority">{task.priority}</span>
            <span className="task-status" onClick={() => toggleStatus(task.id)}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSummary;