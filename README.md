---

# Job Search App

This application facilitates job searching, user management, company profiles, and job applications. It includes APIs for various functionalities such as user sign-up, company management, job posting, and more.

## Features

- **User Management:**
  - Sign Up, Sign In, Update Account, Delete Account
  - Update Password, Forget Password, Get User Account Data
  - Get Profile Data for Another User

- **Company Management:**
  - Add Company, Update Company Data, Delete Company Data
  - Get Company Data, Search for a Company by Name
  - Get Applications for Specific Job

- **Job Management:**
  - Add Job, Update Job, Delete Job
  - Get All Jobs with Company Information
  - Get Jobs for a Specific Company, Filter Jobs

- **Applications:**
  - Apply to Job, Retrieve Applications for Specific Company

## Technologies Used

- Node.js
- Express.js
- Mongoose
- ExcelJS (for bonus Excel sheet generation)

## Setup

1. Clone the repository:
   ```bash
   git clone <[repository-url](https://github.com/Tar2sh12/linkedIn_App)>
   cd <linkedIn_App>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   - Create a `.env` file based on `.env.example` and configure database connection details.

4. Start the application:
   ```bash
   npm run start:dev 
   ```

5. The application will start at `http://localhost:3004` by default.

## API Documentation

For detailed API documentation and examples, refer to the [API Documentation](https://documenter.getpostman.com/view/34540021/2sA3e1CAEi).

## Usage

1. **Sign Up and Sign In:** Users can sign up and log in using their email or mobile number.
2. **User Profile:** Update profile information, change passwords, and manage account settings.
3. **Company Profiles:** HR representatives can add, update, and delete company profiles.
4. **Job Postings:** HR users can add job listings, update details, and manage applications.
5. **Job Search:** Users can search for jobs based on various filters such as location, job title, and seniority level.
6. **Applications:** Users can apply for jobs, and HR users can review applications.



## Bonus Points

- **Excel Sheet Generation:** An endpoint generates an Excel sheet with applications for a specific company on a given day.

## Author

- [Mohamed Tarek](https://github.com/Tar2sh12) - Back-end Developer 
