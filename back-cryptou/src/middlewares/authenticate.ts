import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secret) as any;
        req.body.userId = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

export default authenticate;