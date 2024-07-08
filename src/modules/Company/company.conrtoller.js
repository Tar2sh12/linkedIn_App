import Company from "../../../DB/models/company.model.js";
import User from "./../../../DB/models/user.model.js";
import { ErrorClass } from "../../utils/error-class.utils.js";
import Job from "../../../DB/models/job.model.js";
import Application from "../../../DB/models/application.model.js";
export const addCompany = async (req, res, next) => {
  const { companyName, desc, industry, address, noOfEmployees, companyEmail } =
    req.body;
  const { authUser } = req;
  const isCompanyNameExist = await Company.findOne({
    $or: [{ companyName }, { companyEmail }, {companyHR:authUser._id}],
  });

  if (isCompanyNameExist ) {
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

export const deleteCompany = async (req, res, next) => {
  const { authUser } = req;
  const {_id} = req.params;
  const company = await Company.findById({_id});
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

export const getCompany = async (req, res, next) => {
  const { authUser } = req;
  const {_id} = req.params;
  const company = await Company.findById({_id});
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

export const search = async (req, res, next) => {
    const { search } = req.body;
    const result = await Company.find({
      companyName: { $regex: search, $options: "i" }, // for making it case insensitive search
    });
    res.json({ msg: result });

};

export const getCompanyWithJob = async (req, res, next) => {
    const { authUser } = req;
    const {jobId}= req.body;
    const job = await Job.findById({_id:jobId});
    if (!authUser._id == job.addedBy) {
      return next(
        new ErrorClass(
          "you are not allowed to get those apps",
          400,
          "you are not allowed to get those apps"
        )
      );
    }
    
    const allApp = await Appl.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "addedBy",
          foreignField: "companyHR",
        },
      },
    ]);
    res.json({ allJobs });
  };