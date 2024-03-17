import { readFile } from "../lib/readFile.js";
const handleToCheckUserKey = (user, reqBody) => {
  let userKeys = Object.keys(user).filter((item) => item !== "userId");
  let reqBodyKeys = Object.keys(reqBody)
  let res = [];
  for (const key of reqBodyKeys) {
    if(userKeys.some(item => item == key )){
      res = [...res, key]
    }else{
      return false
    }
  }
  return !!Math.sign(res?.length)
}
export const userController = {
  GET: async function (req, res) {
    let users = await readFile("users");
    const searchParams = req.searchParams;
    const params = req.params;
    if(params && Object.keys(params).length){
        let userIdx = users.findIndex(user => user.userId == params.userId);
        if(userIdx !== -1 || userIdx == 0){
            let user = users.find(user => user.userId == params.userId)
            res.setJSON(user, 200)
        }else{
            res.setJSON({ message: "User Not found or user id its invalid", statusCode: 404 }, 404)
        }
    }else{
        if (searchParams) {
          const store = [];
          for (const user of users) {
            let counter = 0;
            for (let key in searchParams) {
              if (searchParams[key] == user[key]) counter++;
            }
            if (Object.keys(searchParams).length == counter) store.push(user);
          }
          if (store.length) {
            res.setJSON(store, 200);
          } else {
            res.setJSON(users, 400);
          }
        } else {
          if (users.length) {
            res.setJSON(users, 200);
          } else {
            res.json({
              message: "Unfortunately, there are no users",
              users
            });
          }
        }
    }
  },
  POST: async function (req, res) {
    const users = await readFile("users")
    const reqBody = await req.body;
    if (Object.keys(reqBody).length) {
      if (!reqBody.firstName || !reqBody.gender || !reqBody.age) {
        
        res.setJSON({"message": "Invalid user. Name and gender and age required", statusCode: 400, user: reqBody  }, 400)
      }else{
        if((isNaN(reqBody.firstName) && isNaN(reqBody.gender)) && !isNaN(reqBody.age) ){
          reqBody.userId = users.length ? users[users.length-1].userId + 1: 1;
          users.push(reqBody)
          res.toAddDatabase(users, "users")
          res.setJSON({"message": "User created successfull", statusCode: 201, user: reqBody}, 201)
        }else{
          res.setJSON({message: "Invalid user", statusCode: 400, user: reqBody}, 400)
        }
      }
    } else {
        res.setJSON({
            message: "Invalid user",
            statusCode: 400,
            user: reqBody,
          }, 400)
    }
  },
  PUT: async function(req, res) {
    const users = await readFile("users");
    const reqBody = await req.body;
    const params = req.params;
    const idx = users.findIndex(user => user.userId == params.userId)
    if(Object.keys(reqBody).length){
      if(idx >= 0){
        if(handleToCheckUserKey(users[idx], reqBody )){
          users[idx] = {...users[idx], ...reqBody};
           res.toAddDatabase(users, "users")
           res.setJSON({message: "User successfull updated", user: users[idx], statusCode: 200}, 200)
        }else{
          res.setJSON({message: "User update key or keys its invalid", statusCode: 400}, 400)
        }
      }else{
          res.setJSON({message: "User id its invalid", error: "User not found", statusCode: 404}, 404)
      }
    }else{
      res.setJSON({message: "Update data its invalid !", error: "Data its invalid", statusCode: 400}, 400)
    }
  },
  DELETE: async function(req, res) {
    const users = Array.from(await readFile("users"));
    const params = req.params;
    const userIdx = users.findIndex(user => user.userId == params.userId)
    if(userIdx !== -1 && userIdx){
        let deletedUser = users.splice(userIdx, 1);
        res.toAddDatabase(users, "users");
        res.setJSON({message: "User successfull deleted", user: deletedUser,  statusCode: 200}, 200)
    }else{
        res.setJSON({message: "User id its invalid", error: "User not found", statusCode: 404}, 404)     
    }
  }
};
