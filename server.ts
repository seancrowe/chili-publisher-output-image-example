await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './',
});

// Fix bunjs bug
await Bun.write("./index.js", (await Bun.file("./index.js").text()).replace("require_main(), 1)", "require_main())"));

const server = Bun.serve({
  port: 8000,
  fetch: async (req) => {
    const fileName = new URL(req.url).pathname.split("/").filter(Boolean).pop()
    const fileResp = Bun.file(`./${fileName ?? "index.html"}`);
    if (!(await fileResp.exists())) {
      return new Response(`${fileName} not found`, { status: 404, statusText: `${fileName} not found` });
    }
    return new Response(fileResp);
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
