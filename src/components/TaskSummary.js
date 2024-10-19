import React, { useState } from 'react';

const TaskSummary = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design server room layout', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Order cooling systems', status: 'Pending', priority: 'Medium' },
    { id: 3, title: 'Install network cabling', status: 'Completed', priority: 'High' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
    setEditingTask(null);
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? {...task, status: task.status === 'Completed' ? 'In Progress' : 'Completed'}
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.status !== 'Completed';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

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
      <div className="task-filter">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={`task-item ${task.status.toLowerCase().replace(' ', '-')}`}>
            {editingTask && editingTask.id === task.id ? (
              <>
                <input 
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span className="task-title">{task.title}</span>
                <span className="task-priority">{task.priority}</span>
                <span className="task-status" onClick={() => toggleStatus(task.id)}>
                  {task.status}
                </span>
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSummary;