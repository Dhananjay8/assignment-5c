const express = require('express'),
  router = express.Router();

const rootPrefix = "..",
  FetchFromGithub = require(rootPrefix + '/app/services/FetchFromGithub'),
  GetGithubUser = require(rootPrefix + '/app/services/GetGithubUser');

router.post('/github', async function(req, res) {

  const url = req.body.url;

  new FetchFromGithub({
    url: url
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});

router.get('/github/:id', async function(req, res) {

  const github_user_id = req.params.id;

  new GetGithubUser({
    github_user_id: github_user_id
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        console.log(rsp);
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });

});

module.exports = router;
