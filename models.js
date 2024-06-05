import { DataTypes, Model } from 'sequelize';
import { sequelize } from './database.js';
 // замените на вашу строку подключения

export class User extends Model {}

User.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users'
});

export class UserCommits extends Model {}

UserCommits.init({
  commitId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'userId'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'UserCommits',
  tableName: 'user_commits'
});

export class CommitMetrics extends Model {}

CommitMetrics.init({
  commitId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: UserCommits,
      key: 'commitId'
    },
    onDelete: 'CASCADE'
  },
  allocatedMemory: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'CommitMetrics',
  tableName: 'commit_metrics'
});

