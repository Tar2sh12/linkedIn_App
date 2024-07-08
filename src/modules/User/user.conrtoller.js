import Company from "../../../DB/models/company.model.js";
import User from "./../../../DB/models/user.model.js";
import Job from "../../../DB/models/job.model.js";
import Application from "../../../DB/models/application.model.js";
import { hashSync, compareSync } from "bcrypt";
import { ErrorClass } from "../../utils/error-class.utils.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendEmailService } from "../../services/send-email.service.js";
export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    phone,
    role,
  } = req.body;
  const userName = firstName + " " + lastName;
  const isEmailAndPhoneExist = await User.findOne({
    $or: [{ email }, { phone }, { recoveryEmail }],
  });
  if (isEmailAndPhoneExist) {
    return next(
      new ErrorClass("Email already exists", 400, "Email already exists")
    );
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
  const userInstance = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
    recoveryEmail,
    DOB,
    phone,
    role,
    otp,
  });
  //generate token instead of sending _id
  const confirmationToken = jwt.sign(
    { user: userInstance },
    process.env.CONFIRM_TOKEN,
    { expiresIn: "1h" }
  );
  // generate email confirmation link
  const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirmation/${confirmationToken}`;
  //sending email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "welcome",
    // textMessage:"hamsolah bymsi 3alek mn gowa l back-end"
    htmlMessage: `<a href=${confirmationLink}>please verify your account</a>`,
  });
  if (isEmailSent.rejected.length) {
    return res
      .status(500)
      .json({ msg: "verification email sending is failed " });
  }

  await userInstance.save();
  res.status(201).json({ msg: "user created ", userInstance });
};

export const verifyEmail = async (req, res, next) => {
  const { confirmationToken } = req.params;
  const data = jwt.verify(confirmationToken, process.env.CONFIRM_TOKEN);
  const confirmedAuthor = await User.findOneAndUpdate(
    { _id: data?.user._id, isConfirmed: false },
    { isConfirmed: true },
    { new: true }
  );
  if (!confirmedAuthor) {
    return res.status(404).json({ msg: "not confirmed" });
  }
  res
    .status(200)
    .json({ msg: "User email successfully confirmed ", confirmedAuthor });
};

/***
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response {message, token}
 * @description login user
 */
export const login = async (req, res, next) => {
  // destruct email and password from req.body
  const { email, password } = req.body;
  // find user
  const user = await User.findOne({
    $and: [
      { $or: [{ email }, { recoveryEmail: email }] },
      { isConfirmed: true },
    ],
  });
  if (!user) {
    return next(
      new ErrorClass("Invalid credentials", 400, "Invalid credentials")
    );
  }

  // compare password
  const isMatch = compareSync(password, user.password);
  if (!isMatch) {
    return next(
      new ErrorClass("Invalid credentials", 400, "Invalid credentials")
    );
  }
  //update status
  user.status = true;
  await user.save();
  // generate the access token
  const token = jwt.sign({ userId: user._id }, process.env.LOGIN_SECRET, {
    expiresIn: "1d",
  });

  // response
  res.status(200).json({ message: "Login success", token });
};

export const logOut = async (req, res, next) => {
  const { authUser } = req;
  const user = await User.findById(authUser._id);
  user.status = false;
  await user.save();
  res.status(200).json({ msg: "logged out successfuly" });
};
export const updateUser = async (req, res, next) => {
  const { authUser } = req;
  const { email, phone, recoveryEmail, DOB, lastName, firstName } = req.body;
  const isEmailAndPhoneExist = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (isEmailAndPhoneExist) {
    return next(
      new ErrorClass(
        "Email or phone already exists",
        400,
        "Email or phone already exists"
      )
    );
  }

  if (email) {
    const userByEmail = await User.findByIdAndUpdate(
      authUser._id,
      {
        isConfirmed: false,
      },
      { new: true }
    );
    //generate token instead of sending _id
    const confirmationToken = jwt.sign(
      { user: userByEmail },
      process.env.CONFIRM_TOKEN,
      { expiresIn: "1h" }
    );
    // generate email confirmation link
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirmation/${confirmationToken}`;
    //sending email
    const isEmailSent = await sendEmailService({
      to: email,
      subject: "welcome",
      // textMessage:"hamsolah bymsi 3alek mn gowa l back-end"
      htmlMessage: `<a href=${confirmationLink}>please verify your account</a>`,
    });
    if (isEmailSent.rejected.length) {
      return res
        .status(500)
        .json({ msg: "verification email sending is failed " });
    }
  }
  const user = await User.findByIdAndUpdate(
    authUser._id,
    {
      email,
      phone,
      recoveryEmail,
      DOB,
      lastName,
      firstName,
    },
    { new: true }
  );
  user.userName = user.firstName + " " + user.lastName;
  await user.save();
  res.status(200).json({ msg: "user updated ", user });
};
export const deleteUser = async (req, res, next) => {
  const { authUser } = req;
  const job = await Job.find({ addedBy: authUser._id }).select('_id');
  let jobs =[]
  job.forEach((e)=>{
    jobs.push(e._id)
  })
  const deleteCompany = await Company.deleteMany({ companyHR: authUser._id });
  const deleteApp = await Application.deleteMany({
    $or: [
      { userId: authUser._id },
      { jobId: { $in: jobs } }
    ]
  });
  const deleteJob = await Job.deleteMany({ addedBy: authUser._id })
  const dUser = await User.findByIdAndDelete(authUser._id);

  res.status(200).json({ msg: "user deleted ",deleteCompany,deleteJob,dUser, deleteApp });

};

export const getInfo = async (req, res, next) => {
  const { authUser } = req;
  const user = await User.findById(authUser._id).select("-password -_id");
  res.status(200).json({ user });
};

export const getById = async (req, res, next) => {
  const { _id } = req.params;
  const user = await User.findById(_id).select("-password -_id");
  if (!user) {
    return next(
      new ErrorClass(
        "there is no matched users",
        400,
        "there is no matched users"
      )
    );
  }

  res.status(200).json({ user });
};

export const updatePass = async (req, res, next) => {
  const { authUser } = req;
  const { password } = req.body;
  const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
  const user = await User.findByIdAndUpdate(
    authUser._id,
    {
      password: hashedPassword,
    },
    { new: true }
  );
  res.status(200).json({ msg: "user password updated ", user });
};

export const getAllRecovery = async (req, res, next) => {
  const { recoveryEmail } = req.body;
  const user = await User.find({ recoveryEmail }).select("-password -_id");
  if (!user.length) {
    return next(
      new ErrorClass(
        "there is no matched users",
        400,
        "there is no matched users"
      )
    );
  }
  res.status(200).json({ user });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const isUserExists = await User.findOne({
    $or: [{ email }, { recoveryEmail: email }],
  });
  if (!isUserExists) {
    return next(
      new ErrorClass("email doesn't exist", 400, "email doesn't exist")
    );
  }
  //sending email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "welcome",
    // textMessage:"hamsolah bymsi 3alek mn gowa l back-end"
    htmlMessage: `<h1>your otp numbers for reseting the password are : ${isUserExists.otp}</h1>`,
  });
  if (isEmailSent.rejected.length) {
    return res
      .status(500)
      .json({ msg: "verification email sending is failed " });
  }
  res.json({ msg: "check your email" });
};

export const changePassword = async (req, res, next) => {
  const { email, password, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorClass("email doesn't exist", 400, "email doesn't exist")
    );
  }
  if (!user?.otp == otp) {
    return new ErrorClass("otp is wrong");
  }
  const newOTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
  user.password = hashedPassword;
  user.otp = newOTP;
  const savedUser = await user.save();
  res.json({ msg: "password changed", savedUser });
};
