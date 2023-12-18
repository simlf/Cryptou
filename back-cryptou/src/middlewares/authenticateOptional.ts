import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateOptional = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const secret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, secret) as any;
            req.body.userId = decoded;
        } catch (ex) {
            console.error('Invalid token');
        }
    }

    next();
};

export default authenticateOptional;
