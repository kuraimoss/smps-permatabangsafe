const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Path = require("path");

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.HOST || "localhost",
    routes: { cors: true },
  });

  await server.register(Inert);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) =>
      h.file(Path.join(__dirname, "..", "public", "info-pendaftaran.html")),
  });

  server.route({
    method: "GET",
    path: "/info-pendaftaran",
    handler: (request, h) =>
      h.file(Path.join(__dirname, "..", "public", "info-pendaftaran.html")),
  });

  server.route({
    method: "GET",
    path: "/login",
    handler: (request, h) =>
      h.file(Path.join(__dirname, "..", "public", "login.html")),
  });

  server.route({
    method: "POST",
    path: "/login",
    options: {
      payload: {
        output: "data",
        parse: true,
        allow: "application/x-www-form-urlencoded",
      },
    },
    handler: (request, h) => {
      const { username } = request.payload || {};
      return h
        .response({ ok: true, message: `Login received for ${username || "-"}` })
        .code(200);
    },
  });

  server.route({
    method: "GET",
    path: "/public/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "..", "public"),
        listing: false,
        index: false,
      },
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});

createServer();
