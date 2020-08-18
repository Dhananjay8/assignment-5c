const Sequelize = require('sequelize');

const rootPrefix = '../..',
  ServicesBase = require(rootPrefix + '/app/services/Base'),
  GithubUserModel = require(rootPrefix + '/app/models/GithubUser'),
  HttpLibrary = require(rootPrefix + '/lib/HttpRequest'),
  mysqlProvider = require(rootPrefix + '/lib/providers/mysql');

const mysqlInstance = mysqlProvider.getInstance();

class FetchFromGithub extends ServicesBase {
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.url = params.url;
  }

  async _asyncPerform() {
    const oThis = this;

    const githubApiResponseData = await oThis._makeRequest();

    if(githubApiResponseData) {
      await oThis._populateTable(githubApiResponseData);

      return {
        success: true,
        data: {
        }
      }
    } else {
      return {
        success: false,
        data: {}
      }
    }
  }

  async _makeRequest() {
    const oThis = this;

    if(!oThis.url) return null;

    const requestHeader = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Dhananjay-Patil-Project'
    };

    const HttpLibObj = new HttpLibrary({ resource: oThis.url, header: requestHeader });

    let githubApiResponseData = null;

    githubApiResponseData = await HttpLibObj.get({}).catch(function(err) {
      return err;
    });

    if(githubApiResponseData) {
      return JSON.parse(githubApiResponseData)
    }

    return null;
  }

  async _populateTable(githubApiResponseData) {
    const GithubUsers = GithubUserModel(mysqlInstance, Sequelize),
      githubUserIds = [],
      githubUserIdToDetailsMap = {};

    for(let index = 0; index < githubApiResponseData.length; index++) {
      githubUserIds.push(githubApiResponseData[index].id);
      githubUserIdToDetailsMap[githubApiResponseData[index].id] = githubApiResponseData[index];
    }

    const dbUsersResponses = await GithubUsers.findAll({
      where: {
        github_id: githubUserIds
      }
    });

    if(dbUsersResponses.length > 0) {

      for(let index = 0; index < dbUsersResponses.length; index++ ) {
        const dbGithubUser = dbUsersResponses[index],
          userGithubId = dbGithubUser.github_id;

        const updateResp = await mysqlInstance.query(`UPDATE github_users SET name = ?, html_url = ?, description = ?, open_issues = ?, watchers = ?, owner = ? WHERE (github_id = ?)`, {
            replacements:[
              githubUserIdToDetailsMap[userGithubId].name,
              githubUserIdToDetailsMap[userGithubId].html_url,
              githubUserIdToDetailsMap[userGithubId].description,
              githubUserIdToDetailsMap[userGithubId].open_issues,
              (githubUserIdToDetailsMap[userGithubId].watchers) ? githubUserIdToDetailsMap[userGithubId].watchers : null,
              (githubUserIdToDetailsMap[userGithubId].owner) ? JSON.stringify(githubUserIdToDetailsMap[userGithubId].owner) : null,
              userGithubId
            ]
          });

        // console.log('updateResp========', updateResp);

        if(updateResp[0].affectedRows == 0) {
          console.error('Error in updating entry for user: ', userGithubId);
        }
      }
    } else {

      for(let index = 0; index < githubApiResponseData.length; index++ ) {
        let user = githubApiResponseData[index];

        await GithubUsers.create({
          github_id: user.id,
          name: user.name,
          html_url: user.html_url,
          description: (user.description) ? user.description : null,
          open_issues: user.open_issues,
          watchers: (user.watchers) ? user.watchers : null,
          owner: JSON.stringify(user.owner)
        }).catch(function(err) {
          console.error(err);
        });
      }
    }
  }
}

module.exports = FetchFromGithub;
