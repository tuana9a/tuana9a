class Entry {
    constructor(element, baseUrl, url, renderType) {
        this.url = url;
        this.baseUrl = baseUrl;
        this.element = element;
        const preElement = document.createElement("pre");
        this.preElement = preElement;
        element.appendChild(preElement);
        this.renderType = renderType;
        this.renderHanlers = new Map();
        this.renderHanlers.set("raw", (data) => {
            // eslint-disable-next-line no-param-reassign
            preElement.textContent = data;
        });
        this.renderHanlers.set("code", (data) => {
            const codeElement = document.createElement("code");
            codeElement.classList.add(element.getAttribute("data-prism").trim().split(/\s+/));
            codeElement.textContent = data;
            preElement.appendChild(codeElement);
        });
        this.renderHanlers.set("default", (data) => {
            // eslint-disable-next-line no-param-reassign
            preElement.innerHTML = data;
        });
    }

    getFullUrl() {
        let { baseUrl, url } = this;
        if (!baseUrl) {
            return url;
        }
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, -1);
        }
        if (url.startsWith("/")) {
            url = url.substring(1);
        }
        return `${baseUrl}/${url}`;
    }

    startLoading() {
        this.element.classList.add("loading");
    }

    stopLoading() {
        this.element.classList.remove("loading");
    }

    async load() {
        const url = this.getFullUrl();
        const data = await fetch(url).then((res) => res.text());
        this.stopLoading();
        this.render(data);
    }

    render(data) {
        const renderHandler = this.renderHanlers.get(this.renderType);
        const defaultHandler = this.renderHanlers.get("default");
        if (renderHandler) {
            renderHandler(data);
        } else {
            defaultHandler(data);
        }
    }

    remove() {
        // eslint-disable-next-line no-restricted-syntax
        for (const key of this.renderHanlers.keys()) {
            this.renderHanlers.delete(key);
        }
    }
}

async function main() {
    // Create new link Element
    const linkElement = document.createElement("link");
    linkElement.type = "text/css";
    linkElement.rel = "stylesheet";
    linkElement.href = "/libs/fetchAppend.css";

    // Append link element to HTML head
    document.head.appendChild(linkElement);
    // start load entry
    const entries = Array.from(document.getElementsByClassName("fetchAppend")).map((element) => {
        const url = element.getAttribute("data-url");
        const baseUrl = null; // FETCH_APPEND_BASE_URL;
        let renderType = "default";
        if (element.classList.contains("raw")) {
            renderType = "raw";
        } else if (element.classList.contains("code")) {
            renderType = "code";
        }
        const entry = new Entry(element, baseUrl, url, renderType);
        entry.startLoading();
        return entry;
    });

    setTimeout(async () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const entry of entries) {
            // eslint-disable-next-line no-await-in-loop
            await entry.load();
        }
        const prismScriptElement = document.createElement("script");
        prismScriptElement.src = "/libs/prism.js";
        document.body.appendChild(prismScriptElement);
    }, 10);
}

main();
