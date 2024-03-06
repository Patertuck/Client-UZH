/**
 * User model
 */
class UserToDisplay {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.status = null;
    this.creationDate = null;
    this.birthDate = null;
    Object.assign(this, data);
  }
}

export default UserToDisplay;
