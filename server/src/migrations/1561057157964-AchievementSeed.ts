import { MigrationInterface, QueryRunner, getRepository, Repository } from 'typeorm';
import { Achievement } from '../models/Achievement';
import { AchievementRule } from '../models/AchievementRule';

const achievements = [
  {
    achievement: {
      name: 'Good samaritan',
      description: 'Win your first match in co-op mode',
      reward: 50,
    },
    rules: [
      {
        condition: JSON.stringify({
          conditions: {
            all: [
              {
                fact: 'coopMatches',
                operator: 'equal',
                value: 1,
              },
            ],
          },
          event: {
            achievement: 'Good samaritan',
          },
        }),
      },
    ],
  },
  {
    achievement: {
      name: 'Very good samaritan',
      description: 'Win 10 matches in co-op mode',
      reward: 100,
    },
    rules: [
      {
        condition: JSON.stringify({
          conditions: {
            all: [
              {
                fact: 'coopMatches',
                operator: 'equal',
                value: 10,
              },
            ],
          },
          event: {
            achievement: 'Very good samaritan',
          },
        }),
      },
    ],
  },
  {
    achievement: {
      name: 'Great samaritan',
      description: 'Win 50 matches in co-op mode',
      reward: 200,
    },
    rules: [
      {
        condition: JSON.stringify({
          conditions: {
            all: [
              {
                fact: 'coopMatches',
                operator: 'equal',
                value: 50,
              },
            ],
          },
          event: {
            achievement: 'Great samaritan',
          },
        }),
      },
    ],
  },
  {
    achievement: {
      name: 'I like my \\n-s!',
      description: 'Accumulate 100 lines of code',
      reward: 50,
    },
    rules: [
      {
        condition: JSON.stringify({
          conditions: {
            all: [
              {
                fact: 'loc',
                operator: 'equal',
                value: 100,
              },
            ],
          },
          event: {
            achievement: 'I like my \\n-s!',
          },
        }),
      },
    ],
  },
  {
    achievement: {
      name: 'Spread that code!',
      description: 'Accumulate 1000 lines of code',
      reward: 100,
    },
    rules: [
      {
        condition: JSON.stringify({
          conditions: {
            all: [
              {
                fact: 'loc',
                operator: 'equal',
                value: 1000,
              },
            ],
          },
          event: {
            achievement: 'Spread that code!',
          },
        }),
      },
    ],
  },
  {
    achievement: {
      name: 'Typing magician',
      description: 'Accumulate 10000 lines of code',
      reward: 200,
    },
    rules: [
      {
        condition: JSON.stringify({
          conditions: {
            all: [
              {
                fact: 'loc',
                operator: 'equal',
                value: 10000,
              },
            ],
          },
          event: {
            achievement: 'Typing magician',
          },
        }),
      },
    ],
  },
];

export class AchievementSeed1561057157964 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const respository = getRepository('achievement');
    const ruleRepository = getRepository('achievement_rule');
    const newAchievements: Achievement[] = [];
    for (const config of achievements) {
      const achievement = new Achievement();
      achievement.name = config.achievement.name;
      achievement.description = config.achievement.description;
      achievement.reward = config.achievement.reward;
      let rules = config.rules.map(rule => {
        const newRule = new AchievementRule();
        newRule.condition = rule.condition;
        return newRule;
      });
      rules = await ruleRepository.save(rules);
      achievement.rules = rules;
      newAchievements.push(achievement);
    }
    await respository.save(newAchievements);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    const achievementRepository = getRepository('achievement');
    const ruleRepository = getRepository('achievement_rule');
    await achievementRepository.query('TRUNCATE TABLE achievement CASCADE');
    await ruleRepository.clear();
  }
}
