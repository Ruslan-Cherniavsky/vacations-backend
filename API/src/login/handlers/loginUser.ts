import { getConnection } from '../../data_base/data_base';
import { signToken } from './signJwt'
import md5 from "md5";
import { initDB } from '../../data_base/data_base';

//----------------------------------LOGIN POST + AUTORIZATION---------------------------------

async function loginHandler(req, res, next) {
  initDB()
  try {
    const result = await loginUser({ userName: req.body.userName, password: req.body.password, });
    if (!result) throw new Error("User is not authorized")
    const token = signToken({ userName: result.user_name, userId: result.id, role: result.role });
    res.json({ token });
  } catch (ex) {
    return next(ex);
  }
}

interface ILoginUser {
  userName: string;
  password: string;
}
async function loginUser(user: ILoginUser) {
  if (!user.password || !user.userName) throw new Error("Missing paramters");
  const query = `SELECT * FROM bxvtweaofqlvtdjztxk5.users where bxvtweaofqlvtdjztxk5.users.user_name = ? AND bxvtweaofqlvtdjztxk5.users.password = ? `;
  console.log(query);
  const [result] = await getConnection().execute(query, [user.userName, md5(user.password),]);
  console.log(result[0]);
  return result[0];
}

export { loginHandler } 