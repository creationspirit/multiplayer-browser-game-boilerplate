import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

import { auth } from '../middleware/auth';
import { User } from '../models/User';
import { UserStats } from '../models/UserStats';
import { UserStageStats } from '../models/UserStageStats';
import { Stage } from '../models/Stage';
import { fetchUser } from '../config/requests';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { edgarToken } = req.body;
  const repository = getRepository(User);
  const stageRepository = getRepository(Stage);
  try {
    const edgarUser = await fetchUser(edgarToken);
    let user = await repository.findOne({ edgarId: edgarUser.id });
    if (!user) {
      user = new User();
    }
    user.loadFromEdgarResponse(edgarUser);

    if (!user.stats) {
      const stats = new UserStats();
      stats.experience = 0;
      stats.level = 1;
      stats.loc = 0;
      user.stats = stats;
    }

    const stageList = await stageRepository.find({ select: ['id'] });
    stageList.forEach((stage: Stage) => {
      const stageStat = (user as User).stageStats.find(
        (s: UserStageStats) => s.stageId === stage.id
      );
      if (!stageStat) {
        const newStageStats = new UserStageStats();
        newStageStats.stage = stage;
        newStageStats.level = 1;
        newStageStats.loc = 0;
        (user as User).stageStats.push(newStageStats);
      }
    });

    user = await repository.save(user);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ message: 'This token is not valid.' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

export default router;
