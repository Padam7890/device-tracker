import { Request, Response, NextFunction } from 'express';

type AsyncFunction<T = any> = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default <T>(execution: AsyncFunction<T>) => (req: Request, res: Response, next: NextFunction) => {
    execution(req, res, next).catch(next);
};
