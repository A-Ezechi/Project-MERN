const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.json(projects);
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description, category, dueDate } = req.body;

  const project = new Project({
    user: req.user._id,
    name,
    description,
    category,
    dueDate,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, category, dueDate } = req.body;

  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    project.name = name || project.name;
    project.description = description || project.description;
    project.category = category || project.category;
    project.dueDate = dueDate || project.dueDate;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    await project.remove();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Upload an attachment to a project
// @route   POST /api/projects/:id/attachments
// @access  Private
const uploadAttachment = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400);
      throw new Error('No files were uploaded.');
    }

    const file = req.files.file;
    const fileName = file.name;
    const filePath = `/uploads/${fileName}`;

    file.mv(`${__dirname}/../uploads/${fileName}`, (err) => {
      if (err) {
        console.error(err);
        res.status(500);
        throw new Error('File upload failed');
      }

      project.attachments.push({ fileName, filePath });
      project.save();

      res.json({ message: 'File uploaded', fileName, filePath });
    });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadAttachment,
};
