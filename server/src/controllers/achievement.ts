import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

import { auth } from '../middleware/auth';
import { Achievement } from '../models/Achievement';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const repository = getRepository(Achievement);
  const achievements = await repository.find({
    relations: ['users'],
  });
  const newAchievements: any[] = [];
  achievements.forEach(achievement => {
    const newAchievement: any = achievement;
    newAchievement.completed = achievement.users.find(user => user.id === req.user.id)
      ? true
      : false;
    newAchievement.userCount = achievement.users.length;
    delete newAchievement.users;
    newAchievements.push(newAchievement);
  });
  try {
    res.send({ achievements: newAchievements });
  } catch (e) {
    res.status(400).send({ message: 'Unable to fetch achievements.' });
  }
});

export default router;
