
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function isNotLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/dashboard");
}
function forceLogout(req,res,next) {
    if(!req.isAuthenticated()){
        return next();
    }
    req.flash('error',"Invalid Access!."  );
    req.logout();
    res.redirect("/");
}

export default { 
    isLoggedIn, 
    isNotLoggedIn,
    forceLogout
};