//class constructor to hold id and gameRoom

module.exports = class GameClass {
  constructor(gameNumber, user) {
    this.gameNumber = gameNumber;
    this.user = user;
  }
  getGameRoom() {
    return this.gameNumber;
  }
  getUserName() {
    return this.user;
  }
}
