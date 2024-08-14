import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/employees');
                setEmployees(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    // Search Filter
    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Sorting
    const sortedEmployees = [...currentEmployees].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Delete Employee
    const deleteEmployee = async id => {
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`);
            setEmployees(employees.filter(employee => employee._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="employee-list-container">
            <h2>Employee List</h2>

            {/* Search Filter */}
            <input
                type="text"
                placeholder="Enter Search Keyword"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
            />

            {/* Employee Table */}
            <table className="employee-list-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')}>Unique Id</th>
                        <th>Image</th>
                        <th onClick={() => requestSort('name')}>Name</th>
                        <th onClick={() => requestSort('email')}>Email</th>
                        <th>Mobile No</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th onClick={() => requestSort('createdAt')}>Create Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedEmployees.map((employee, index) => (
                        <tr key={employee._id}>
                            <td>{index + 1}</td>
                            <td>
                                <img src={employee.image} alt="employee" className="employee-image"/>
                            </td>
                            <td>{employee.name}</td>
                            <td>
                                <a href={`mailto:${employee.email}`} className="email-link">{employee.email}</a>
                            </td>
                            <td>{employee.mobileNo}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.course}</td>
                            <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button className="action-btn" onClick={() => navigate(`/edit-employee/${employee._id}`)}>Edit</button> - 
                                <button className="action-btn" onClick={() => deleteEmployee(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)} className="page-btn">
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
