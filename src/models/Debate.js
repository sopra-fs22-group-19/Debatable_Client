/**
 * Debate model
 */
class Debate {
    constructor(data = {}) {
        this.debateId = null;
        this.topic = null;
        this.description = null;
        this.tags = null;
        this.userId = null;
        Object.assign(this, data);
    }
}
export default Debate;
