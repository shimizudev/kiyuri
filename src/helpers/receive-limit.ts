export function calculateReceiveLimit(points: number): { giveLimit: number, receiveLimit: number } {
    // Base limits
    let giveLimit = 100;
    let receiveLimit = 100;

    // Increase limits based on user's points
    if (points >= 1000) {
        giveLimit = 500;
        receiveLimit = 500;
    }
    if (points >= 5000) {
        giveLimit = 1000;
        receiveLimit = 1000;
    }
    if (points >= 10000) {
        giveLimit = 2000;
        receiveLimit = 2000;
    }
    if (points >= 50000) {
        giveLimit = 5000;
        receiveLimit = 5000;
    }
    if (points >= 100000) {
        giveLimit = 10000;
        receiveLimit = 10000;
    }

    // Handle infinite points case
    if (points === Infinity) {
        giveLimit = Infinity;
        receiveLimit = Infinity;
    }

    return {
        giveLimit,
        receiveLimit
    };
}
