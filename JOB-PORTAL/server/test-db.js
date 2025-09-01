const mongoose = require('mongoose');
const config = require('./config');
const Application = require('./models/Application');

async function testDatabase() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating an application
    console.log('📝 Testing Application model...');
    
    const testApplication = new Application({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test Street, Test City',
      jobTitle: 'Test Developer',
      company: 'Test Company',
      resumePath: '/test/resume.pdf'
    });
    
    // Save the test application
    const savedApp = await testApplication.save();
    console.log('✅ Test application saved successfully!');
    console.log('📋 Application ID:', savedApp._id);
    
    // Test finding applications
    const applications = await Application.find();
    console.log('📊 Total applications in database:', applications.length);
    
    // Clean up test data
    await Application.findByIdAndDelete(savedApp._id);
    console.log('🧹 Test application cleaned up');
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 Duplicate key error - this is expected for unique constraints');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testDatabase();

