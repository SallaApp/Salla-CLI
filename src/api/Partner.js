const SallaApi = require("./SallaApi");

module.exports = class PartnerAPI extends SallaApi {
  constructor(args) {
    super(args);

    this.app_types = [
      {
        lable: "Public",
        desc: "Available for all Salla Merchants to download and use.",
      },
      {
        lable: "Private",
        desc: "Privately built apps for integration to larger scaled and individual merchants.",
      },
      {
        lable: "Shipping",
        desc: "Best suitable for shipping companies and delivery services.",
      },
    ];
  }
  getAppUrl(app_id) {
    return BASE_URL + `/apps/${app_id}/listings`;
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

  async getAppByName(app_name) {
    let apps = await this.getAllApps();

    let app_data = apps.filter(
      (app) => app.name.en.toLocaleLowerCase() === app_name.toLocaleLowerCase()
    )[0];
    return await this.getApp(app_data.id);
  }
  async getApp(app_name) {
    if (typeof app_name === "string") {
      let apps = await this.getAllApps();

      return apps.filter(
        (app) =>
          app.name.en.toLocaleLowerCase() === app_name.toLocaleLowerCase()
      )[0];
    } else {
      let results = await this.requestURL(
        this.baseEndpoint + "app/" + app_name,
        "get",
        null,
        null,
        this.accessToken
      );
      if (results.status === 200) {
        return results.data;
      }
    }
  }
  async getUserInfo() {
    let results = await this.requestURL(
      this.baseEndpoint + "me",
      "get",
      null,
      null,
      this.accessToken
    );

    if (results.status === 200) {
      return results.data;
    }
    return null;
  }
  async updateWebhookURL(app_id, webhook_url) {
    let results = await this.requestURL(
      this.baseEndpoint + "app/webhooks/url/" + app_id,
      "POST",
      {
        webhook_url: webhook_url,
        webhooks: [],
      },
      null,
      this.accessToken
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
      },
      null,
      this.accessToken
    );
    if (results.status === 200) {
      return results.data;
    }
  }
  async deleteApp(app_id) {
    let results = await this.requestURL(
      this.baseEndpoint + "app/" + app_id,
      "DELETE",
      null,
      null,
      this.accessToken
    );

    if (results.status === 200) {
      return results.data;
    }
  }
  async publishApp(app_id) {
    let results = await this.requestURL(
      this.baseEndpoint + "app/publish/" + app_id,
      "POST",
      null,
      null,
      this.accessToken
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
  async isAppExist(app_id) {
    try {
      await this.requestURL(
        this.baseEndpoint + "app/" + app_id,
        "get",
        null,
        null,
        this.accessToken
      );
      return true;
    } catch (err) {
      return false;
    }
  }
};
