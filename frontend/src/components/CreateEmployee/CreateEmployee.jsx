import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CreateEmployee.css';

const CreateEmployee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        course: [],
        imgUpload: null,
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                course: checked
                    ? [...formData.course, value]
                    : formData.course.filter((course) => course !== value),
            });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const { name, email, mobileNo, designation, gender, course, imgUpload } = formData;

        if (!name || !email || !mobileNo || !designation || !gender || course.length === 0 || !imgUpload) {
            Swal.fire('Error', 'Please fill out all required fields.', 'error');
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailPattern.test(email)) {
            Swal.fire('Error', 'Please enter a valid email address.', 'error');
            return false;
        }

        const mobilePattern = /^\d+$/;
        if (!mobilePattern.test(mobileNo)) {
            Swal.fire('Error', 'Mobile number should only contain digits.', 'error');
            return false;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (imgUpload.size > maxSize) {
            Swal.fire('Error', 'Image size should be less than 2MB.', 'error');
            return false;
        }

        if (!['image/jpeg', 'image/png'].includes(imgUpload.type)) {
            Swal.fire('Error', 'Only JPG and PNG formats are allowed.', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/employees', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', 'Employee created successfully', 'success');
            navigate('/employee-list');
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to create employee. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-employee-container">
            <form onSubmit={handleSubmit} className="employee-form">
                <div className="input-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Mobile No:</label>
                    <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Designation:</label>
                    <select name="designation" value={formData.designation} onChange={handleChange}>
                        <option value="">Select Designation</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Gender:</label>
                    <div className="gender-options">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={handleChange}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={handleChange}
                            />
                            Female
                        </label>
                    </div>
                </div>
                <div className="input-group">
                    <label>Course:</label>
                    <div className="course-options">
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="MCA"
                                checked={formData.course.includes('MCA')}
                                onChange={handleChange}
                            />
                            MCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="BCA"
                                checked={formData.course.includes('BCA')}
                                onChange={handleChange}
                            />
                            BCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="BSC"
                                checked={formData.course.includes('BSC')}
                                onChange={handleChange}
                            />
                            BSC
                        </label>
                    </div>
                </div>
                <div className="input-group">
                    <label>Image:</label>
                    <input type="file" name="imgUpload" onChange={handleChange} accept=".jpg,.jpeg,.png" />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default CreateEmployee;
