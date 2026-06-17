import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter from "./admin-auth";
import adminSeriesRouter from "./admin/series";
import adminLecturesRouter from "./admin/lectures";
import adminWordsRouter from "./admin/words";
import adminShortsRouter from "./admin/shorts";
import adminStatsRouter from "./admin/stats";
import adminCategoriesRouter from "./admin/categories";
import adminYoutubeRouter from "./admin/youtube";
import adminSuggestionsRouter from "./admin/suggestions";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/stats", adminStatsRouter);
router.use("/admin/series", adminSeriesRouter);
router.use("/admin/lectures", adminLecturesRouter);
router.use("/admin/words", adminWordsRouter);
router.use("/admin/shorts", adminShortsRouter);
router.use("/admin/knowledge-categories", adminCategoriesRouter);
router.use("/admin/youtube", adminYoutubeRouter);
router.use("/admin/suggest-category", adminSuggestionsRouter);

export default router;
