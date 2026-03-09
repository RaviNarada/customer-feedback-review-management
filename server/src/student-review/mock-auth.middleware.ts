import { Request, Response, NextFunction } from "express";

// Mock auth middleware — replace with real JWT middleware from auth-module when merged
export const mockAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // In production, this comes from JWT token verification
  // The auth-module will attach req.user via their middleware
  if (!(req as any).user) {
    (req as any).user = { id: "mock-trainee-id-001", role: "TRAINEE" };
  }
  next();
};
