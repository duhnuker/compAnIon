function middleware(req, res, next) {
    const { email, name, password } = req.body;
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    if (req.path === "/register") {
        console.log(!(email === null || email === void 0 ? void 0 : email.length));
        //Check if any field is empty
        if (![email, name, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    else if (req.path === "/login") {
        //Check if email or password is empty
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    //continues with route
    next();
}
;
export default middleware;
