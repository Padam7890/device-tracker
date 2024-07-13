"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.envMode = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_js_1 = require("./middlewares/error.js");
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mainRoute_js_1 = __importDefault(require("./routes/mainRoute.js"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config({ path: './.env', });
exports.envMode = ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) || 'DEVELOPMENT';
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: ' * ', credentials: true }));
app.use((0, morgan_1.default)('dev'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express_1.default.static('public'));
console.log("file" + __dirname, "public");
(0, mainRoute_js_1.default)(app);
app.use(error_js_1.errorMiddleware);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log("connection established");
    socket.on("send location", (data) => {
        io.emit("receive-location", Object.assign({ id: socket.id }, data));
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
server.listen(port, () => console.log('Server is working on Port:' + port + ' in ' + exports.envMode + ' Mode.'));
