import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, updateProject, getTasks, addTask } from '../api/api';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    description: '',
    category: 'college',
    dueDate: '',
  });
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      const data = await getProjectById(id, token);
      setProject(data);
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const data = await getTasks(id, token);
      setTasks(data);
    };

    fetchProject();
    fetchTasks();
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await updateProject(id, project, token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating project', error);
    }
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem('token');
    try {
      await addTask(id, { name: taskName, dueDate: taskDueDate }, token);
      const data = await getTasks(id, token);
      setTasks(data);
      setTaskName('');
      setTaskDueDate('');
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  return (
    <div className="container">
      <h1>Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={project.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={project.category}
            onChange={handleChange}
          >
            <option value="college">College</option>
            <option value="internship">Internship</option>
            <option value="work">Work</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={project.dueDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>

      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <Link to={`/project/${id}/task/${task._id}`}>
              {task.name} - Due: {new Date(task.dueDate).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <h3>Add Task</h3>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
};

export default Project;
