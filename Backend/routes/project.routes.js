import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create',
    authMiddleware.authUser,
    body('name').notEmpty().withMessage('Project name is required'),
    projectController.createProject
);

router.get('/all',
    authMiddleware.authUser,
    projectController.getAllProjects
);

router.put('/addUser',
    authMiddleware.authUser,
    body('projectId')
        .isString().notEmpty().withMessage('Project ID is required'),
    body('users')
        .isArray({ min: 1 }).withMessage('Users must be a non-empty array')
        .custom((arr) => arr.every(u => typeof u === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
);

router.get('/get-project/:projectId',
    authMiddleware.authUser,
    projectController.getProjectById
);

export default router;