import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

import { auth } from '../middleware/auth';
import { User } from '../models/User';
import { UserStats } from '../models/UserStats';
import { fetchUser } from '../config/requests';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { edgarToken } = req.body;
  const repository = getRepository(User);
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
    await repository.save(user);
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
