import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter from "./admin-auth";
import adminSeriesRouter from "./admin/series";
import adminStatsRouter from "./admin/stats";
import adminCategoriesRouter from "./admin/categories";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/stats", adminStatsRouter);
router.use("/admin/series", adminSeriesRouter);
router.use("/admin/knowledge-categories", adminCategoriesRouter);

export default router;
