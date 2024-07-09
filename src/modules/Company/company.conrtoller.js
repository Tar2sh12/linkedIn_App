import Company from "../../../DB/models/company.model.js";
import User from "./../../../DB/models/user.model.js";
import { ErrorClass } from "../../utils/error-class.utils.js";
import Job from "../../../DB/models/job.model.js";
import Application from "../../../DB/models/application.model.js";

import excel from "exceljs";


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , company}
 * @description addCompany
 */
export const addCompany = async (req, res, next) => {
  const { companyName, desc, industry, address, noOfEmployees, companyEmail } =
    req.body;
  const { authUser } = req;
  const isCompanyNameExist = await Company.findOne({
    $or: [{ companyName }, { companyEmail }, { companyHR: authUser._id }],
  });

  if (isCompanyNameExist) {
    return next(
      new ErrorClass("company already exists", 400, "company already exists")
    );
  }
  const company = new Company({
    companyName,
    desc,
    industry,
    address,
    noOfEmployees,
    companyEmail,
    companyHR: authUser._id,
  });
  await company.save();
  res.status(201).json({ msg: "company created", company });
};


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , updatedCompany}
 * @description updateCompany
 */
export const updateCompany = async (req, res, next) => {
  const { companyName, desc, industry, address, noOfEmployees, companyEmail } =
    req.body;
  const { authUser } = req;
  const { _id } = req.params;
  const company = await Company.findById({ _id });
  if (!authUser._id == company.companyHR) {
    return next(
      new ErrorClass(
        "you are not allowed to update this company",
        400,
        "you are not allowed to update this company"
      )
    );
  }
  const isCompanyNameExist = await Company.findOne({
    $or: [{ companyName }, { companyEmail }],
  });
  if (isCompanyNameExist) {
    return next(
      new ErrorClass("company already exists", 400, "company already exists")
    );
  }
  const updatedCompany = await Company.findByIdAndUpdate(
    _id,
    {
      companyName,
      desc,
      industry,
      address,
      noOfEmployees,
      companyEmail,
    },
    { new: true }
  );
  res.status(200).json({ msg: "updated", updatedCompany });
};


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , deletedCompany}
 * @description deleteCompany
 */
export const deleteCompany = async (req, res, next) => {
  const { authUser } = req;
  const { _id } = req.params;
  const company = await Company.findById({ _id });
  if (!authUser._id == company.companyHR) {
    return next(
      new ErrorClass(
        "you are not allowed to delete this company",
        400,
        "you are not allowed to delete this company"
      )
    );
  }
  const deletedCompany = await Company.findByIdAndDelete(_id);
  res.status(200).json({ msg: "deleted", deletedCompany });
};


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {company}
 * @description getCompany
 */
export const getCompany = async (req, res, next) => {
  const { authUser } = req;
  const { _id } = req.params;
  const company = await Company.findById({ _id });
  if (!authUser._id == company.companyHR) {
    return next(
      new ErrorClass(
        "you are not allowed to get this company",
        400,
        "you are not allowed to get this company"
      )
    );
  }
  res.status(200).json({ company });
};


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {result}
 * @description search by company name
 */
export const search = async (req, res, next) => {
  const { search } = req.body;
  const result = await Company.find({
    companyName: { $regex: search, $options: "i" }, // for making it case insensitive search
  });
  res.json({ msg: result });
};



/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {allApp}
 * @description Get all applications for specific Jobs
 */
export const getCompanyWithJob = async (req, res, next) => {
  const { authUser } = req;
  const { jobId } = req.body;
  const job = await Job.findById({ _id: jobId });
  if (!authUser._id == job.addedBy) {
    return next(
      new ErrorClass(
        "you are not allowed to get those apps",
        400,
        "you are not allowed to get those apps"
      )
    );
  }

  const allApp = await Application.find({ jobId: jobId }).populate([
    { path: "userId" },
  ]);
  res.json({ allApp });
};


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {}
 * @description the bonus endpoint
 */
export const excelEndpoint = async (req, res, next) => {
  const { _id } = req.params;
  const company = await Company.findById(_id);
  if (!company) {
    return next(new ErrorClass("Company does not exist", 404));
  }

  const job = await Job.findOne({ addedBy: company.companyHR });
  if (!job) {
    return next(new ErrorClass("No job found for this company", 404));
  }

  const applications = await Application.find({ jobId: job._id });

  // Create Excel workbook and worksheet
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  // Define headers
  worksheet.columns = [
    { header: "Job Id", key: "jobId", width: 30 },
    { header: "User Id", key: "userId", width: 30 },
    {header: "TechSkills", key: "userTechSkills", width: 30 },
    {header: "SoftSkills", key: "userSoftSkills", width: 30 }
    // Add more headers as needed
  ];

  // Populate data
  applications.forEach((app) => {
    worksheet.addRow({
      jobId: app.jobId,
      userId: app.userId,
      userTechSkills: app.userTechSkills.toString(),
      userSoftSkills: app.userSoftSkills.toString(),
      // Add more data fields as needed
    });
  });

  // Set response headers for Excel file download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment;filename=" + "applications.xlsx"
  );

  // Write workbook to response
  await workbook.xlsx.write(res);
  res.end();
};
