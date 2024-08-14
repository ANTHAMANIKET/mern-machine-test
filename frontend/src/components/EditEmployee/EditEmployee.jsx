import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditEmployee.css';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        course: [],
        imgUpload: ''
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
                setFormData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                course: checked
                    ? [...formData.course, value]
                    : formData.course.filter((course) => course !== value)
            });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        try {
            await axios.put(`http://localhost:5000/api/employees/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Employee updated successfully');
            navigate('/employee-list'); // Redirect to employee list after successful update
        } catch (err) {
            console.error(err);
            alert('Failed to update employee. Please try again.');
        }
    };

    return (
        <div className="edit-employee-container">
            <h2>Edit Employee</h2>
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
                    <input type="file" name="imgUpload" onChange={handleChange} />
                </div>
                <button type="submit" className="submit-btn">Update</button>
            </form>
        </div>
    );
};

export default EditEmployee;
