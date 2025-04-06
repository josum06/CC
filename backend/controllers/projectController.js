const imagekit = require("../imageKit");
const Project = require("../models/Project");
const CommentProject = require("../models/CommentProject");

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      githubUrl,
      projectUrl,
      userId,
      category,
      TechStack,
      contributors,
    } = req.body;

    let mediaUrl = null;


    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Missing file parameter for upload" });
    }

    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/user-project",
    });
    mediaUrl = uploadedImage.url;

    // Build project data dynamically
    const projectData = {
      title,
      description,
      githubUrl,
      projectUrl,
      userId,
      category,
      TechStack,
      mediaUrl,
    };

    if (contributors) {
      let parsedContributors = contributors;

      // Parse only if it's a string (e.g., from form-data)
      if (typeof contributors === "string") {
        try {
          parsedContributors = JSON.parse(contributors);
        } catch (e) {
          console.warn("Invalid JSON in contributors:", contributors);
          parsedContributors = [];
        }
      }

      // Only add if parsed value is a non-empty array
      if (Array.isArray(parsedContributors) && parsedContributors.length > 0) {
        projectData.contributors = parsedContributors;
      }
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json(project);
    console.log(`Project created successfully: ${project}`);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "userId",
      "fullName profileImage "
    ).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createCommentProject = async (req, res) => {
  try {
    const { text, projectId, userId } = req.body;
    console.log(text, projectId, userId);

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Create new comment
    const newCommentProject = new CommentProject({ text, projectId, userId });
    await newCommentProject.save();

    // Push the comment ID into the project's comments array
    project.comments.push(newCommentProject._id);
    await project.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newCommentProject,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjectComments = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).json({ message: "Missing projectId parameter" });
    }
    const comments = await CommentProject.find({ projectId }).populate(
      "userId",
      "fullName profileImage"
    );
    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
