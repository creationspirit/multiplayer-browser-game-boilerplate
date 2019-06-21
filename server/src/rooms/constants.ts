export enum MessageType {
  LVL_INIT = 'LVL_INIT',
  MOVE = 'move',
  SOLUTION_UPDATE = 'supd',
  SOLVE_ATTEMPT = 'solv',
  COLLECT = 'coll',
  DISPLAY_REWARD = 'drew',
}

export enum GameStatus {
  ONGOING = 'ong',
  WIN = 'win',
  LOSE = 'los',
  OVER = 'ovr',
}

export enum QuestionStatus {
  STANDARD = 'std',
  EVALUATE = 'eval',
  SOLVED = 'solv',
  PARTIAL = 'part',
}

export enum Teams {
  BLUE = 'blu',
  RED = 'red',
}
