class DebateRoom {
    constructor(data = {}) {
        this.debate = null;
        this.debateStatus = null;
        this.roomId = null;
        this.side1 = null;
        this.side2 = null;
        this.user1 = null;
        this.user2 = null;
        Object.assign(this, data);
    }
}
export default DebateRoom;
