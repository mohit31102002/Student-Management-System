API Utilities for Student Management Dashboard
 * 
 * This file demonstrates:
 * - Async/await patterns
 * - Promise handling
 * - Event loop behavior
 * - Error handling in async operations
 */

// Mock API base URL (in a real app, this would be your backend URL)
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Mock API function to simulate fetching courses
 * Demonstrates async/await and event loop behavior
 */
const fetchCourses = async () => {
  console.log('🚀 Starting course fetch...'); // This runs immediately
  
  try {
    // Simulate network delay to demonstrate async behavior
    // This shows how the event loop handles asynchronous operations
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('📡 Network request completed'); // This runs after the delay
        
        // Simulate occasional network errors (10% chance)
        if (Math.random() < 0.1) {
          reject(new Error('Network error occurred'));
        }
        
        resolve({
          status: 200,
          data: [
            { id: 1, name: "HTML Basics", description: "Learn the fundamentals of HTML", duration: "4 weeks" },
            { id: 2, name: "CSS Mastery", description: "Master CSS styling and layouts", duration: "6 weeks" },
            { id: 3, name: "JavaScript Pro", description: "Advanced JavaScript concepts", duration: "8 weeks" },
            { id: 4, name: "React In Depth", description: "Build modern React applications", duration: "10 weeks" },
            { id: 5, name: "Node.js Backend", description: "Server-side JavaScript development", duration: "8 weeks" },
            { id: 6, name: "Database Design", description: "SQL and NoSQL database concepts", duration: "6 weeks" },
            { id: 7, name: "Full Stack Project", description: "Complete full-stack application", duration: "12 weeks" }
          ]
        });
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });
    
    console.log('✅ Course data processed successfully'); // This runs after the Promise resolves
    return response.data;
    
  } catch (error) {
    console.error('❌ Error fetching courses:', error.message);
    
    // Return fallback data in case of error
    return [
      { id: 1, name: "HTML Basics", description: "Learn the fundamentals of HTML", duration: "4 weeks" },
      { id: 2, name: "CSS Mastery", description: "Master CSS styling and layouts", duration: "6 weeks" },
      { id: 3, name: "JavaScript Pro", description: "Advanced JavaScript concepts", duration: "8 weeks" },
      { id: 4, name: "React In Depth", description: "Build modern React applications", duration: "10 weeks" }
    ];
  }
};

/**
 * Mock API function to simulate saving a student
 * Demonstrates async/await with form data
 */
const saveStudent = async (studentData) => {
  console.log('💾 Saving student data...', studentData);
  
  try {
    // Simulate validation and save operation
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        if (!studentData.name || !studentData.email) {
          reject(new Error('Name and email are required'));
        }
        
        // Simulate occasional server errors (5% chance)
        if (Math.random() < 0.05) {
          reject(new Error('Server error occurred'));
        }
        
        resolve({
          status: 201,
          data: {
            ...studentData,
            id: Date.now(), // Generate unique ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }, 300 + Math.random() * 200); // Random delay between 300-500ms
    });
    
    console.log('✅ Student saved successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error saving student:', error.message);
    throw error; // Re-throw to be handled by calling code
  }
};

/**
 * Mock API function to simulate updating a student
 */
const updateStudent = async (studentId, updatedData) => {
  console.log(`🔄 Updating student ${studentId}...`, updatedData);
  
  try {
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        if (!updatedData.name || !updatedData.email) {
          reject(new Error('Name and email are required'));
        }
        
        resolve({
          status: 200,
          data: {
            ...updatedData,
            id: studentId,
            updatedAt: new Date().toISOString()
          }
        });
      }, 200 + Math.random() * 100);
    });
    
    console.log('✅ Student updated successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error updating student:', error.message);
    throw error;
  }
};

/**
 * Utility function to generate profile image URL
 * This function shows JavaScript hoisting behavior
 */
function generateProfileImage(name) {
  // This function is hoisted, so it can be called before its declaration
  const encodedName = encodeURIComponent(name);
  const colors = ['6366f1', '8b5cf6', 'ec4899', 'f59e0b', '10b981', 'ef4444'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${randomColor}&color=fff&size=128&bold=true`;
}

/**
 * Utility function to validate email format
 * Demonstrates regular expressions and validation
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Utility function to format date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Demonstration of the event loop with multiple async operations
 * This function shows how JavaScript handles asynchronous code
 */
const demonstrateEventLoop = async () => {
  console.log('🔄 Event Loop Demonstration Started');
  
  // Synchronous code runs first
  console.log('1. Synchronous code - runs immediately');
  
  // setTimeout with 0 delay goes to the task queue
  setTimeout(() => {
    console.log('4. setTimeout callback - runs after call stack is empty');
  }, 0);
  
  // Promise.resolve goes to the microtask queue (higher priority than task queue)
  Promise.resolve().then(() => {
    console.log('3. Promise microtask - runs before setTimeout');
  });
  
  // More synchronous code
  console.log('2. More synchronous code - runs immediately');
  
  // Async/await with a Promise
  try {
    const result = await new Promise(resolve => {
      setTimeout(() => {
        resolve('6. Async/await result - runs after current execution');
      }, 100);
    });
    console.log(result);
  } catch (error) {
    console.error('Error in async operation:', error);
  }
  
  console.log('5. After await - runs after the Promise resolves');
};

/**
 * Debounce function for search input
 * Demonstrates closures and higher-order functions
 */
const debounce = (func, delay) => {
  let timeoutId;
  
  return function(...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Local storage utilities for data persistence
 * Note: In a real application, you'd use a proper backend
 */
const LocalStorageAPI = {
  // Save students to localStorage
  saveStudents: (students) => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
      console.log('📱 Students saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  },
  
  // Load students from localStorage
  loadStudents: () => {
    try {
      const students = localStorage.getItem('students');
      return students ? JSON.parse(students) : [];
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      return [];
    }
  },
  
  // Clear all data
  clearData: () => {
    try {
      localStorage.removeItem('students');
      console.log('🗑️ Student data cleared from localStorage');
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }
  }
};

// Export all functions for use in other files
// Note: In a real React app, you'd use ES6 modules (export/import)
window.ApiUtils = {
  fetchCourses,
  saveStudent,
  updateStudent,
  generateProfileImage,
  validateEmail,
  formatDate,
  demonstrateEventLoop,
  debounce,
  LocalStorageAPI
};

// Demonstrate the event loop when this file loads
console.log('📚 API Utils loaded - demonstrating event loop...');
demonstrateEventLoop();