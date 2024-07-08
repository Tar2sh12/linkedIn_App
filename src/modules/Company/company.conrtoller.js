import Company from "../../../DB/models/company.model.js";
import User from "./../../../DB/models/user.model.js";
import { ErrorClass } from "../../utils/error-class.utils.js";

export const addCompany = async (req, res, next) => {
  const { companyName, desc, industry, address, noOfEmployees, companyEmail } =
    req.body;
  const { authUser } = req;
  const isCompanyNameExist = await Company.findOne({
    $or:[{companyName},{companyEmail}]
    
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
  res.status(201).json({msg:"company created", company})
};
