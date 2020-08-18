const Sequelize = require('sequelize');

const rootPrefix = '../..',
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  GithubUserModel = require(rootPrefix + '/app/models/GithubUser'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

class GetGithubUser extends ServicesBase {
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.githubUserId = params.github_user_id;

    oThis.details = {};
  }

  async _asyncPerform() {
    const oThis = this;

    await oThis._fetchFromDb();

    return {
      success: true,
      data: oThis.details
    }
  }

  async _fetchFromDb() {
    const oThis = this,
      GithubUser = GithubUserModel(mysqlInstance, Sequelize);

    const githubUserResponse = await GithubUser.findAll({
      where: {
        github_id: oThis.githubUserId
      }
    });

    // console.log('githubUserResponse========', githubUserResponse);

    if(githubUserResponse && githubUserResponse.length > 0) {
      oThis.details = githubUserResponse[0].dataValues;
    }
  }
}

module.exports = GetGithubUser;

