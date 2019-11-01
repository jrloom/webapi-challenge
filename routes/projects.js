const router = require("express").Router();
const actionDB = require("../data/helpers/actionModel");
const projectDB = require("../data/helpers/projectModel");

const serverError = "Server had trouble filling request";

// * Get all projects
router.get("/", (req, res) => {
  projectDB
    .get()
    .then(project => res.status(200).json(project))
    .catch(err => res.status(500).json({ error: serverError }));
});

// * Get project by ID
router.get("/:id", validateProjectID, (req, res) => {
  res.status(200).json(req.project);
});

// * Add project
router.post("/", validateProject, (req, res) => {
  projectDB
    .insert(req.body)
    .then(project => res.status(201).json(project))
    .catch(err => res.status(500).json({ error: serverError }));
});

// * Update project
router.put("/:id", validateProjectID, validateProject, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  projectDB
    .update(id, body)
    .then(project =>
      project
        ? res.status(200).json({ message: `Project ${id} has been updated` })
        : res.status(404).json({ error: `Project ${id} not found` })
    )
    .catch(err => status(500).json({ error: serverError }));
});

// * Delete project
router.delete("/:id", validateProjectID, (req, res) => {
  const id = req.params.id;

  projectDB
    .remove(id)
    .then(project => {
      project
        ? res.status(202).json({ message: `Project ${id} has been removed` })
        : res.status(404).json({ error: `Project ${id} not found` });
    })
    .catch(err => res.status(500).json({ error: serverError }));
});

// * Middleware
function validateProjectID(req, res, next) {
  const id = req.params.id;

  projectDB
    .get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ error: `Project ${id} not found` });
      }
    })
    .catch(err => res.status(500).json({ error: serverError }));
}

function validateProject(req, res, next) {
  const { name, description } = req.body;

  if (!name || !description) {
    res
      .status(400)
      .json({ message: "Missing required field: name or description" });
  } else {
    next();
  }
}

module.exports = router;
