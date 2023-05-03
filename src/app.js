import express from "express";
import handlebars from "express-handlebars";
import database from "./db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import passport from "passport";
import initializePassport from "./auth/passport.js";
import socket from "./socket.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import __dirname from "./utils.js";
import cookieParser from "cookie-parser";
import config from "./config.js";
import bodyParser from "body-parser";

// Initialization
const { DB_USER, DB_PASS, DB_NAME, DB_URL, SESSION_SECRET } = config;
const app = express();
const PORT = 3000;

// Settings
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// MiddleWares
// app.use(cookieParser());
app.use(
	express.json({
		type: ["application/json", "text/plain"],
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: DB_URL,
			ttl: 60 * 5,
		}),
		resave: true,
		saveUninitialized: false,
		secret: SESSION_SECRET,
	})
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use("/", express.static(`${__dirname}/public`));
app.use(morgan("dev"));

// Database connection
database.connect();

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, (req, res) => {
	console.log(`Server listening on port ${PORT}`);
});

// Websocket Server
socket.connect(httpServer);
