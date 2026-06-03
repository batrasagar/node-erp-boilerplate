import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';

const router = Router();

router.get('/plans', PublicController.getPlans);
router.get('/slug-check/:slug', PublicController.checkSlug);
router.post('/signup', PublicController.signup);

export default router;
