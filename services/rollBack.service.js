class RollbackManager {
    constructor() {
        this.actions = [];
    }

    // Add rollback action
    add(action) {
        if (typeof action !== "function") {
            throw new Error("Rollback action must be a function");
        }
        this.actions.push(action);
    }

    // Execute all rollback actions in reverse order
    async rollback() {
        for (let i = this.actions.length - 1; i >= 0; i--) {
            try {
                await this.actions[i]();
            } catch (err) {
                console.error("Rollback failed for an action:", err);
            }
        }
    }

    // Optional: clear actions after success
    clear() {
        this.actions = [];
    }
}

module.exports = RollbackManager;