import { readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import crypto from "crypto";


const port = 3000;
const DATA_FILE = path.join("data", "links.json");

// serverFile now accepts req/res
const serverFile = async (res, filePath, contentType) => {
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 page not found");
    }
};

const loadLinks = async () => {
    try {
        const data = await readFile(DATA_FILE, "utf-8");

        if (!data.trim()) return {};

        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeFile(DATA_FILE, "{}");
            return {};
        }
        throw error;
    }
};


const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links));
};

const server = createServer(async (req, res) => {
    if (req.method === "GET") {
        if (req.url === "/") {
            await serverFile(res, path.join("public", "index.html"), "text/html");
        } else if (req.url === "/style.css") {
            await serverFile(res, path.join("public", "style.css"), "text/css");
        } else if (req.url == '/links') {
            const links = await loadLinks();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(links));
        }
        else {
            const links = await loadLinks();

            const shortUrl = req.url.slice(1); // remove "/"

            if (links[shortUrl]) {
                res.writeHead(302, { Location: links[shortUrl] });
                return res.end();
            }
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Short URL not found");
        }
    }

    if (req.method === "POST" && req.url == "/shorten") {
        let body = "";

        const links = await loadLinks();

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            console.log(body);

            const { originalURL, shortURL } = JSON.parse(body);

            if (!originalURL) {
                res.writeHead(404, { "Content-Type": "text/html" });
                return res.end("URL is required");
            }

            const finalShortURL = shortURL || crypto.randomBytes(4).toString("hex");

            if (links[finalShortURL]) {
                res.writeHead(404, { "Content-Type": "text/html" });
                return res.end("Short URL already exists, choose another URL");
            }

            links[finalShortURL] = originalURL;
            await saveLinks(links);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, shortURL: finalShortURL }));
        });
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
