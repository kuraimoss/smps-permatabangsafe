const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Path = require("path");
const Fs = require("fs/promises");

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
    handler: (request, h) => h.redirect("/login"),
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

  server.route({
    method: "GET",
    path: "/image/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "image"),
        listing: false,
        index: false,
      },
    },
  });

  server.route({
    method: "GET",
    path: "/api/logos",
    handler: async (request, h) => {
      const imageDir = Path.join(__dirname, "image");
      const allowedExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

      let entries = [];
      try {
        entries = await Fs.readdir(imageDir, { withFileTypes: true });
      } catch {
        return h.response({ logos: [] }).code(200);
      }

      const logos = entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => allowedExt.has(Path.extname(name).toLowerCase()))
        .filter((name) => !/^home\./i.test(name))
        .sort((a, b) => a.localeCompare(b, "id"))
        .map((name) => ({ name, url: `/image/${encodeURIComponent(name)}` }));

      return h.response({ logos }).code(200);
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
