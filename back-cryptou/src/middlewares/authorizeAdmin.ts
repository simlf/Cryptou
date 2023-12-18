import { Request, Response, NextFunction } from 'express';
const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.userId;
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied. Admin privileges required.');
    }
};

export default authorizeAdmin;
