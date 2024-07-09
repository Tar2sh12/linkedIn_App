import Company from "../../../DB/models/company.model.js";
import User from "./../../../DB/models/user.model.js";
import { ErrorClass } from "../../utils/error-class.utils.js";
import Job from "../../../DB/models/job.model.js";
import Application from "../../../DB/models/application.model.js";

/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , job}
 * @description addJob
 */
export const addJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { authUser } = req;

  const job = new Job({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: authUser._id,
  });
  await job.save();
  res.status(201).json({ msg: "job created", job });
};




/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , updatedJob}
 * @description update Job
 */
export const updateJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { authUser } = req;
  const { _id } = req.params;
  const job = await Job.findById({ _id });
  if (!authUser._id == job.addedBy) {
    return next(
      new ErrorClass(
        "you are not allowed to update this job",
        400,
        "you are not allowed to update this job"
      )
    );
  }

  const updatedJob = await Job.findByIdAndUpdate(
    _id,
    {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  );
  res.status(200).json({ msg: "updated", updatedJob });
};




/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , deletedJob ,deletedApp}
 * @description delete Job and any associated application to this job
 */
export const deleteJob = async (req, res, next) => {
  const { authUser } = req;
  const { _id } = req.params; //job id
  const job = await Job.findById({ _id });
  if (!authUser._id == job.addedBy) {
    return next(
      new ErrorClass(
        "you are not allowed to update this job",
        400,
        "you are not allowed to update this job"
      )
    );
  }
  const deletedApp = await Application.deleteMany({jobId:_id});
  
  const deletedJob = await Job.findByIdAndDelete(_id);
  res.status(200).json({ msg: "deleted", deletedJob ,deletedApp });
};


/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {message , applicationFullFilled}
 * @description apply To Job
 */
export const applyToJob = async (req, res, next) => {
  const { authUser } = req;
  const { _id } = req.params; // job id
  const { userTechSkills, userSoftSkills } = req.body;
  const apply = new Application({
    jobId: _id,
    userId: authUser?._id,
    userTechSkills,
    userSoftSkills,
  });
  const applicationFullFilled = await apply.save();
  res.status(201).json({ msg: "applied successfuly", applicationFullFilled });
};



/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {allJobs}
 * @description Get all Jobs with their company’s information.
 */
export const jobWithCompany = async (req, res, next) => {
  const { authUser } = req;
  const allJobs = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHR",
        as: "company info",
      },
    },
  ]);
  res.json({ allJobs });
};




/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {allJobs}
 * @description get Jobs By CompanyName
 */
export const getJobsByCompanyName = async (req, res, next) => {
  const { authUser } = req;
  const { companyName } = req.query;
  const company = await Company.findOne({
    companyName,
  });
  if (!company) {
    return next(
      new ErrorClass("company does not exists", 400, "company does not exists")
    );
  }
  const allJobs = await Job.find({
    addedBy: company.companyHR,
  });
  res.json({ allJobs });
};




/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns return response {allJobs}
 * @description filter jobs with workingTime , jobLocation , seniorityLevel , jobTitle and technicalSkills
 */
export const filter = async (req, res, next) => {
  const { authUser } = req;
  const {
    technicalSkills=[] ,
    seniorityLevel,
    workingTime,
    jobLocation,
    jobTitle,
  } = req.body;
  const filters = {};

  // Check if each filter exists in req.query and add it to filters object if present
  if (workingTime) {
    filters.workingTime = workingTime;
  }
  if (jobLocation) {
    filters.jobLocation = jobLocation;
  }
  if (seniorityLevel) {
    filters.seniorityLevel = seniorityLevel;
  }
  if (jobTitle) {
    filters.jobTitle = jobTitle;
  }
  if (technicalSkills.length) {
    filters.technicalSkills = technicalSkills;
  }
  const allJobs = await Job.find(filters);
  res.json({ allJobs });
};
