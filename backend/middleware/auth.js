const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try { //use try...catch to ressolve if the problems appears
		const token = req.headers.authorization.split(' ')[1]; //take a token header from the entry request and split it between space and get the second value after keyword Bearer
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //function verify to decode token
		const userId = decodedToken.userId; //take a userId from the token
		if (req.body.userId && req.body.userId !== userId) { //if the request has same id user as a token then valid ifnot send error
			throw 'Invalid user ID';
		} else {
			next(); //continue to other middleware applicated
		}
	} catch {
		res.status(401).json({
			error: new Error('Invalid request!')
		});
	}
};