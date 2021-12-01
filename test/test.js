require("../constants");
const GithubAPI = new (require("../src/utils/AuthManager/Github"))();
console.log("GithubAPI", GithubAPI);
GithubAPI.setGithubConfigData({
  access_token: "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",
  login: "kkk",
  email: "test",
});
GithubAPI.gitSimple.checkIsRepo().then(async (isRepo) => {
  if (isRepo) {
    return;
  }
  Logger.warn("Git repo not existed yet.");

  await this.initiateRepo(github);
});
GithubAPI.initiateRepo({
  message: "test",
  isPrivate: true,
});
GithubAPI.addAndCommit({ message: "something", tagName: "testingtags" });
