'use strict';

import { Response, Request, NextFunction } from 'express';

export let getApi = (req: Request, res: Response) => {
  res.send({
    hello: 'WORLD',
  });
};
