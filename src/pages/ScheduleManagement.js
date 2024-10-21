import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function ScheduleManagement() {
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', startDate: '', endDate: '', progress: 0, milestone: '' });
  const [newMilestone, setNewMilestone] = useState({ name: '', dueDate: '', requirements: '' });

  useEffect(() => {
    fetchTasks();
    fetchMilestones();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchMilestones = async () => {
    try {
      const response = await axios.get('/api/milestones');
      setMilestones(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleMilestoneInputChange = (e) => {
    const { name, value } = e.target;
    setNewMilestone(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ name: '', startDate: '', endDate: '', progress: 0, milestone: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/milestones', newMilestone);
      setMilestones([...milestones, response.data]);
      setNewMilestone({ name: '', dueDate: '', requirements: '' });
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const formatDataForCalendar = () => {
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.name,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      allDay: true,
      resource: 'task'
    }));

    const formattedMilestones = milestones.map(milestone => ({
      id: `milestone-${milestone.id}`,
      title: milestone.name,
      start: new Date(milestone.dueDate),
      end: new Date(milestone.dueDate),
      allDay: true,
      resource: 'milestone'
    }));

    return [...formattedTasks, ...formattedMilestones];
  };
  
  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: event.resource === 'task' ? '#3174ad' : '#ad4ca3',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  return (
    <div className="schedule-management">
      <h1>Schedule Management</h1>

      <section className="calendar-chart">
        <h2>Project Timeline</h2>
        <Calendar
          localizer={localizer}
          events={formatDataForCalendar()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'agenda']}
        />
      </section>

      <section className="tasks-section">
        <h2>Tasks</h2>
        <form onSubmit={handleTaskSubmit}>
          <input
            type="text"
            name="name"
            value={newTask.name}
            onChange={handleTaskInputChange}
            placeholder="Task Name"
            required
          />
          <input
            type="date"
            name="startDate"
            value={newTask.startDate}
            onChange={handleTaskInputChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={newTask.endDate}
            onChange={handleTaskInputChange}
            required
          />
          <input
            type="number"
            name="progress"
            value={newTask.progress}
            onChange={handleTaskInputChange}
            placeholder="Progress (%)"
            min="0"
            max="100"
            required
          />
          <select
            name="milestone"
            value={newTask.milestone}
            onChange={handleTaskInputChange}
          >
            <option value="">Select Milestone</option>
            {milestones.map(milestone => (
              <option key={milestone.id} value={milestone.id}>{milestone.name}</option>
            ))}
          </select>
          <button type="submit">Add Task</button>
        </form>

        {tasks.length === 0 ? (
          <p>No tasks available. Please add a new task.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.name} - Start: {task.startDate}, End: {task.endDate}, Progress: {task.progress}%
                {task.milestone && ` - Milestone: ${milestones.find(m => m.id === task.milestone)?.name}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="milestones-section">
        <h2>Milestones</h2>
        <form onSubmit={handleMilestoneSubmit}>
          <input
            type="text"
            name="name"
            value={newMilestone.name}
            onChange={handleMilestoneInputChange}
            placeholder="Milestone Name"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={newMilestone.dueDate}
            onChange={handleMilestoneInputChange}
            required
          />
          <textarea
            name="requirements"
            value={newMilestone.requirements}
            onChange={handleMilestoneInputChange}
            placeholder="Milestone Requirements"
            required
          />
          <button type="submit">Add Milestone</button>
        </form>

        {milestones.length === 0 ? (
          <p>No milestones available. Please add a new milestone.</p>
        ) : (
          <ul>
            {milestones.map((milestone) => (
              <li key={milestone.id}>
                {milestone.name} - Due: {milestone.dueDate}
                <p>Requirements: {milestone.requirements}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ScheduleManagement;