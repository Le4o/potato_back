"use strict";

const User = use("App/Models/User");

class SessionController {
  async store({ request, response, auth }) {
    /*
    const isLoggedIn = await auth.check();
    if (isLoggedIn) {
      await auth.logout();
    }
    */
    const { email, password } = request.all();

    try {
      const { token } = await auth.attempt(email, password);
      const { id, score } = await User.findByOrFail("email", email);
      return { token, id, score };
    } catch (error) {
      console.log(error);
      return response
        .status(400)
        .json({ message: "Não foi possível efetuar o login, trouxa" });
    }
  }

  async decreaseScore({ request, params, response }) {
    const { new_score } = request.only(["new_score"]);

    const user = await User.findOrFail(params.id);

    user.score = new_score;

    await user.save();
    return response.status(202).json({ message: "Atualizou, Davi é gado" });
  }

  async index({ response }) {
    const users = await User.all();
    return users;
  }
}

module.exports = SessionController;
