import bcryptjs from "bcryptjs";

const createHashValue = async (val) => {
  const salt = await bcryptjs.genSalt();
  return await bcryptjs.hashSync(val, salt);
};

const isValidPasswd = (psw, encryptedPsw) => {//se quito el async await pues siempre daba true
  return bcryptjs.compareSync(psw, encryptedPsw);//se quito el async await pues siempre daba true
};

export {
  createHashValue,
  isValidPasswd,
};
