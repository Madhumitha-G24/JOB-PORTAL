# Job Portal Server Setup

## Email Configuration

To enable email notifications for job applications, you need to configure Gmail settings:

### 1. Gmail App Password Setup

1. Go to your Google Account settings: https://myaccount.google.com/
2. Enable 2-Step Verification if not already enabled
3. Go to Security > App passwords
4. Select "Mail" as the app and "Other" as the device
5. Generate the app password
6. Copy the generated password (16 characters)

### 2. Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/jobportal

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com

# Server Configuration
PORT=5000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

## Features

- Resume analysis and skill extraction
- Job matching based on skills
- Job application submission
- Email confirmation for applications
- MongoDB storage for applications
- File upload handling for resumes

## API Endpoints

- `POST /api/analyze` - Analyze resume and extract skills
- `POST /api/apply` - Submit job application
- `GET /api/applications` - Get all applications (admin)

## Database Schema

Applications are stored with the following fields:
- name (String, required)
- email (String, required)
- jobTitle (String, required)
- company (String, required)
- resumePath (String, required)
- appliedAt (Date, auto-generated)


