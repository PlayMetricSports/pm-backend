// utils/socket/socket.js
const { Server } = require('socket.io');
// const redisAdapter = require('socket.io-redis');
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
let io = null;
const connectedClients = {
    students: {}, // { studentId: socket }
    teachers: {}, // { teacherId: socket }
};
function getReadableSocketInfo(socket) {
    return {
        id: socket.id,
        connected: socket.connected,
        namespace: socket.nsp.name,
        remoteAddress: socket.handshake.address,
        forwardedFor: socket.handshake.headers['x-forwarded-for'],
        origin: socket.handshake.headers.origin,
        referer: socket.handshake.headers.referer,
        time: socket.handshake.time,
        query: socket.handshake.query,
        events: Object.keys(socket._events),
        data: socket.data,
    };
}
async function initializeSocket(server) {

    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });
    const pubClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, });

    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        socket.on('ping', () => {
            socket.emit('pong');
        });

        socket.on('register', ({ role, userId }) => {
            socket.role = role;
            socket.userId = userId;

            if (role === 'student') {
                connectedClients.students[userId] = socket;
            } else if (role === 'teacher') {
                connectedClients.teachers[userId] = socket;
            }

            console.log(`${role} connected: ${userId}`);
        });

        // connectedUsers.add(socket.id);
        console.log('Socket connected:', socket.id);

        socket.on('student_warning', (warningData) => {
            const { studentId } = warningData;
            console.log({ date: new Date().toUTCString, warningData })
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}

function getSocketInstance() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = {
    initializeSocket,
    getSocketInstance
};
