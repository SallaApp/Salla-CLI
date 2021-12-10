const SallaApi = require("./SallaApi");

module.exports = class PartnerAPI extends SallaApi {
  constructor(args) {
    super(args);

    this.app_types = ["public", "private", "shipping"];
  }
  addNewApp(
    { name_ar, name_en },
    { short_description_ar, short_description_en },
    email,
    type,
    app_url
  ) {
    // TODO: add logo
    let NewAppObject = {
      logo: "",
      name: { ar: name_ar || name_en, en: name_en || name_ar },
      short_description: {
        ar: short_description_ar || short_description_en,
        en: short_description_en || short_description_ar,
      },
      email,
      app_url,
      type,
    };

    return this.request("add", NewAppObject);
  }
  async getAllApps() {
    let results = await this.request("apps");
    if (results.status === 200) {
      return results.data;
    }
  }
  async getApp(app_name) {
    if (typeof app_name === "string") {
      let apps = await this.getAllApps();
      return apps.filter((app) => app.name.en === app_name)[0];
    } else {
      let results = await this.requestURL(
        this.baseEndpoint + "app/" + app_name,
        "get"
      );
      if (results.status === 200) {
        return results.data;
      }
    }
  }
  async updateWebhookURL(app_id, webhook_url) {
    let results = await this.requestURL(
      this.baseEndpoint + "app/webhooks/" + app_id,
      "POST",
      {
        webhook_url: webhook_url,
        webhooks: [],
      }
    );
    if (results.status === 200) {
      return results.data;
    }
  }
  async updateRedirectURL(app_id, redirect_url) {
    let results = await this.requestURL(
      this.baseEndpoint + "app/redirect_url/" + app_id,
      "PUT",
      {
        redirect_urls: [redirect_url],
      }
    );
    if (results.status === 200) {
      return results.data;
    }
  }

  addDemoStore(name, password) {
    let NewDemoStore = {
      name,
      password,
      password_confirmation,
    };
    // save demo store data pass and user
    // install app in demo store
    /*
   
    */
  }
  deleteAllDemoStores(name, password) {
    let NewDemoStore = {
      name,
      password,
      password_confirmation,
    };
    // save demo store data pass and user
    // install app in demo store
  }
};
