import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Mail, BookOpen, Plus, Edit, Save, X, Users, GraduationCap, AlertCircle, Loader } from 'lucide-react';

// Mock API function to simulate fetching courses
const fetchCourses = async () => {
  // Simulate network delay and demonstrate async/await + event loop
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Course fetch completed - demonstrating event loop timing');
      resolve([
        { id: 1, name: "HTML Basics" },
        { id: 2, name: "CSS Mastery" },
        { id: 3, name: "JavaScript Pro" },
        { id: 4, name: "React In Depth" },
        { id: 5, name: "Node.js Backend" },
        { id: 6, name: "Database Design" }
      ]);
    }, 1000); // Simulated API delay
  });
};

// Custom hook for form validation - demonstrates React best practices
const useFormValidation = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!values.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!values.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(values.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!values.course) {
      newErrors.course = 'Course selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return { values, setValues, errors, validate };
};

export default function StudentDashboard() {
  // State management using React hooks
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form state using custom validation hook
  const { values: formData, setValues: setFormData, errors, validate } = useFormValidation({
    name: '',
    email: '',
    course: '',
    profileImage: ''
  });

  // Fetch courses on component mount - demonstrates useEffect and async/await
  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log('Starting course fetch...'); // Event loop demonstration
        setCoursesLoading(true);
        
        // This demonstrates async/await with the event loop
        const courseData = await fetchCourses();
        setCourses(courseData);
        
        console.log('Courses loaded successfully'); // This runs after the Promise resolves
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
    
    // Demonstrate event loop with multiple async operations
    setTimeout(() => {
      console.log('This setTimeout callback runs after the sync code, showing event loop behavior');
    }, 0);
    
    console.log('This runs immediately - before async operations complete');
  }, []); // Empty dependency array ensures this runs only once

  // Memoized course options for performance - demonstrates useMemo
  const courseOptions = useMemo(() => {
    return courses.map(course => ({
      value: course.id,
      label: course.name
    }));
  }, [courses]);

  // Generate random avatar URL
  const generateAvatar = (name) => {
    return https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128;
  };

  // Add new student - demonstrates controlled components and state management
  const handleAddStudent = async () => {
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call with async/await
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStudent = {
      id: Date.now(), // Simple ID generation
      name: formData.name.trim(),
      email: formData.email.trim(),
      course: courseOptions.find(c => c.value === parseInt(formData.course))?.label || '',
      courseId: parseInt(formData.course),
      profileImage: formData.profileImage || generateAvatar(formData.name),
      enrolledDate: new Date().toLocaleDateString()
    };

    // State update - React will batch these updates
    setStudents(prev => [...prev, newStudent]);
    setFormData({ name: '', email: '', course: '', profileImage: '' });
    setShowForm(false);
    setLoading(false);
  };

  // Edit student functionality
  const handleEditStudent = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.courseId.toString(),
      profileImage: student.profileImage
    });
  };

  const handleUpdateStudent = async () => {
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    setStudents(prev => prev.map(student => 
      student.id === editingId 
        ? {
            ...student,
            name: formData.name.trim(),
            email: formData.email.trim(),
            course: courseOptions.find(c => c.value === parseInt(formData.course))?.label || '',
            courseId: parseInt(formData.course),
            profileImage: formData.profileImage || generateAvatar(formData.name.trim())
          }
        : student
    ));

    setEditingId(null);
    setFormData({ name: '', email: '', course: '', profileImage: '' });
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', course: '', profileImage: '' });
  };

  // Memoized statistics for performance
  const stats = useMemo(() => {
    const courseCount = new Set(students.map(s => s.courseId)).size;
    return {
      totalStudents: students.length,
      coursesInUse: courseCount,
      totalCourses: courses.length
    };
  }, [students, courses]);

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="bg-indigo-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your students efficiently</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.coursesInUse}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <GraduationCap className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Student Form */}
        {(showForm || editingId) && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  cancelEdit();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter student name"
                    />
                    {errors.name && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="student@example.com"
                    />
                    {errors.email && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enrolled Course *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none bg-white ${
                        errors.course ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select a course</option>
                      {courseOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.course && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.course}
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.profileImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty for auto-generated avatar</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={editingId ? handleUpdateStudent : handleAddStudent}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingId ? 'Update Student' : 'Add Student'}</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    cancelEdit();
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">All Students</h2>
            <p className="text-gray-600 mt-1">Manage and view student information</p>
          </div>
          
          {students.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Yet</h3>
              <p className="text-gray-600 mb-6">Add your first student to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add First Student
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map((student) => (
                <div key={student.id} className="p-6 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={student.profileImage}
                          alt={student.name}
                          className="w-16 h-16 rounded-full object-cover shadow-lg ring-4 ring-white"
                          onError={(e) => {
                            e.target.src = generateAvatar(student.name);
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                        <div className="flex items-center space-x-1 text-gray-600 mt-1">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 mt-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium text-indigo-600">{student.course}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enrolled: {student.enrolledDate}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-md"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}