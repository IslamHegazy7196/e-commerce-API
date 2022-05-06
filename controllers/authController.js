const login=async(req,res)=>{
    res.send('login')
}
const logout=async(req,res)=>{
    res.send('logout')
}
const register=async(req,res)=>{
    res.send('register')
}

module.exports={login,logout,register}