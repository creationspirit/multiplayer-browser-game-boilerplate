import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

import { auth } from '../middleware/auth';
import { Stage } from '../models/Stage';
import { fetchExercises } from '../config/requests';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const repository = getRepository(Stage);
  try {
    let exercises = await fetchExercises();
    exercises = exercises.map((e: any) => {
      return { ...e, title: e.title.replace('GAME__', '') };
    });
    const stages = await repository.find();
    exercises.forEach((e: any) => {
      const index = stages.findIndex((stage: Stage) => stage.edgarId === e.id);
      if (index !== -1) {
        stages[index].title = e.title;
        stages[index].description = e.description;
      } else {
        const newStage = new Stage();
        newStage.loadFromEdgarResponse(e);
        stages.push(newStage);
      }
    });
    await repository.save(stages);
    res.send({ stages });
  } catch (e) {
    res.status(400).send({ message: 'Unable to fetch stages.' });
  }
});

export default router;
