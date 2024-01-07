import { Request, Response, NextFunction } from 'express';
const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.body.userRole;
    if (userRole && userRole === 1) {
        next();
    } else {
        res.status(403).send('Access denied. Admin privileges required.');
    }
};

export default authorizeAdmin;
