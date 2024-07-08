import User from "./../../../DB/models/user.model.js";
import { hashSync, compareSync } from "bcrypt";
import { ErrorClass } from "../../utils/error-class.utils.js";
import jwt from "jsonwebtoken";
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
  const isEmailAndPhoneExist = await User.findOne({ email, phone });
  if (isEmailAndPhoneExist) {
    return next(
      new ErrorClass("Email already exists", 400, "Email already exists")
    );
  }

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
  });
  await userInstance.save();
  res.status(201).json({ msg: "user created ", userInstance });
};
/***
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response {message, token}
 * @description login user
 */
export const login = async (req, res,next) => {
  // destruct email and password from req.body
  const { email, password } = req.body;
  // find user
  const user = await User.findOne({ email });
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
  user.status=true;
  await user.save();
  // generate the access token
  const token = jwt.sign({ userId: user._id }, process.env.LOGIN_SECRET,{expiresIn:"1d"});
  

  // response
  res.status(200).json({ message: "Login success", token });
};

export const logOut = async (req, res,next) => {
  const {authUser} =req;
  const user = await User.findById(authUser._id);
  user.status=false;
  await user.save();
  res.status(200).json({msg:"logged out successfuly"})
}
export const updateUser = async (req, res, next) => {
  const {authUser} =req;
  const {
    email , phone , recoveryEmail , DOB , lastName , firstName
  } = req.body;
  const isEmailAndPhoneExist = await User.findOne({ $or:[{email}, {phone}] });
  if (isEmailAndPhoneExist) {
    return next(
      new ErrorClass("Email or phone already exists", 400, "Email or phone already exists")
    );
  }
  const user = await User.findByIdAndUpdate(authUser._id,{
    email , phone , recoveryEmail , DOB , lastName , firstName
  },{new:true});
  user.userName= user.firstName+" "+user.lastName;
  await user.save();
  res.status(200).json({ msg: "user updated ", user });
};
export const deleteUser = async (req, res, next) => {
  const {authUser} =req;
  console.log(authUser);
  const dUser= await User.findByIdAndDelete(authUser._id);
  res.status(200).json({ msg: "user deleted ", dUser });
}

export const getInfo = async  (req, res, next) => {
  const {authUser} =req;
  console.log(authUser);
  const user= await User.findById(authUser._id).select("-password -_id");
  res.status(200).json({  user });
}

export const getById = async  (req, res, next) => {
  const {_id} =req.params;
  const user= await User.findById(_id).select("-password -_id");
  if (!user) {
    return next(
      new ErrorClass("there is no matched users", 400, "there is no matched users")
    );
  }

  res.status(200).json({  user });
}

export const updatePass = async (req, res, next) => {
  const {authUser} =req;
  const {
    password
  } = req.body;
  const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
  const user = await User.findByIdAndUpdate(authUser._id,{
    password:hashedPassword
  },{new:true});
  res.status(200).json({ msg: "user password updated ", user });
};

export const getAllRecovery = async  (req, res, next) => {
  const {recoveryEmail} =req.body;
  const user= await User.find({recoveryEmail}).select("-password -_id");
  if (!user.length) {
    return next(
      new ErrorClass("there is no matched users", 400, "there is no matched users")
    );
  }

  res.status(200).json({  user });
}