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
- MongoDB (or specify your database)
- Cloudinary (for user resume uploads)
- ExcelJS (for bonus Excel sheet generation)

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables as per `.env.example`.
4. Start the server using `npm start`.

## API Documentation

Detailed API documentation can be found in the following collections:

- [User APIs](link_to_user_apis_documentation)
- [Company APIs](link_to_company_apis_documentation)
- [Jobs APIs](link_to_jobs_apis_documentation)

## Usage

1. **Sign Up and Sign In:** Users can sign up and log in using their email or mobile number.
2. **User Profile:** Update profile information, change passwords, and manage account settings.
3. **Company Profiles:** HR representatives can add, update, and delete company profiles.
4. **Job Postings:** HR users can add job listings, update details, and manage applications.
5. **Job Search:** Users can search for jobs based on various filters such as location, job title, and seniority level.
6. **Applications:** Users can apply for jobs, and HR users can review applications.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/feature-name`).
6. Create a new Pull Request.

## Bonus Points

- **Excel Sheet Generation:** An endpoint generates an Excel sheet with applications for a specific company on a given day.

## Author

- [Mohamed Tarek](https://github.com/Tar2sh12) - Back-end Developer 
