import bcryptjs from "bcryptjs";

const createHashValue = async (val) => {
  const salt = await bcryptjs.genSalt();
  return await bcryptjs.hashSync(val, salt);
};

const isValidPasswd = async (psw, encryptedPsw) => {
  return await bcryptjs.compareSync(psw, encryptedPsw);
};

export {
  createHashValue,
  isValidPasswd,
};
