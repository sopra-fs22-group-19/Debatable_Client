/**
 * Debate model
 */
class User {
    constructor(data = {}) {
        this.debateId = null;
        this.topic = null;
        this.description = null;
        this.tags = null;
        this.userId = null;
        Object.assign(this, data);
    }
}
export default User;
