const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPG and PNG files are allowed'), false);
        }
    }
});

// @route   POST /api/employees
// @desc    Add a new employee
// @access  Public
router.post(
    '/',
    upload.single('imgUpload'),
    [
       
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email')
            .isEmail().withMessage('Invalid email format')
            .custom(async (email) => {
                const existingEmployee = await Employee.findOne({ email });
                if (existingEmployee) {
                    throw new Error('Email already in use');
                }
            }),
        body('mobileNo')
            .isNumeric().withMessage('Mobile number must be numeric')
            .isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10-15 digits'),
        body('designation').trim().notEmpty().withMessage('Designation is required'),
        body('gender').trim().notEmpty().withMessage('Gender is required'),
        body('course').trim().notEmpty().withMessage('Course is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, mobileNo, designation, gender, course } = req.body;
        const image = req.file ? req.file.path : '';

        try {
            let employee = new Employee({
                name,
                email,
                mobileNo,
                designation,
                gender,
                course,
                image,
            });

            employee = await employee.save();
            res.json(employee);
        } catch (err) {
            console.error('Error saving employee:', err);
            res.status(500).send('Server Error');
        }
    }
);


router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Server Error');
    }
});


router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).send('Server Error');
    }
});


router.put(
    '/:id',
    upload.single('imgUpload'),
    [
       
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('mobileNo')
            .isNumeric().withMessage('Mobile number must be numeric')
            .isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10-15 digits'),
        body('designation').trim().notEmpty().withMessage('Designation is required'),
        body('gender').trim().notEmpty().withMessage('Gender is required'),
        body('course').trim().notEmpty().withMessage('Course is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, mobileNo, designation, gender, course } = req.body;
        const image = req.file ? req.file.path : '';

        const employeeFields = {};
        if (name) employeeFields.name = name;
        if (email) employeeFields.email = email;
        if (mobileNo) employeeFields.mobileNo = mobileNo;
        if (designation) employeeFields.designation = designation;
        if (gender) employeeFields.gender = gender;
        if (course) employeeFields.course = course;
        if (image) employeeFields.image = image;

        try {
            let employee = await Employee.findById(req.params.id);

            if (!employee) return res.status(404).json({ msg: 'Employee not found' });

            employee = await Employee.findByIdAndUpdate(
                req.params.id,
                { $set: employeeFields },
                { new: true }
            );

            res.json(employee);
        } catch (err) {
            console.error('Error updating employee:', err);
            res.status(500).send('Server Error');
        }
    }
);


router.delete('/:id', async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);

        if (!employee) return res.status(404).json({ msg: 'Employee not found' });

        await Employee.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
