module.exports = (sequelize, type) => {
  return sequelize.define('github_user',{
    id: {
      type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      github_id: type.INTEGER,
      name: type.STRING,
      html_url: type.STRING,
      description: type.TEXT,
      created_at: type.STRING,
      open_issues: type.STRING,
      watchers: type.STRING,
      owner: type.TEXT,

  },
    {underscored: true})
};


//{
// 	id: <>,
// 	name: <>,
// 	html_url: <>,
// 	description: <>,
// 	created_at: <>,
// 	open_issues: <>,
// 	watchers: <>,
// 	owner:{
// 		id: <>,
// 		avatar_url: <>,
// 		html_url: <>
// 		type: <>,
// 		site_admin: <>
// 	}
// }
