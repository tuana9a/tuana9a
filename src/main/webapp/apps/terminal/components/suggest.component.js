import BaseComponent from "../../../global/components/base.component";
import SuggestEntryComponent from "./suggest-entry.component";

export default class SuggestComponent extends BaseComponent {
    constructor(opts = { maxEntryCount: 10, onchoose: null }) {
        super(document.createElement("div"));
        this.classList().add("TypingSuggest", "position-absolute");
        this.selectingIndex = 0;
        this.maxEntryCount = opts.maxEntryCount;
        this.wordDict = new Map();
        this.historyDict = new Map();
        this.entries = [];
        for (let i = 0; i < this.maxEntryCount; i += 1) {
            const entry = new SuggestEntryComponent();
            entry.disable();
            if (opts.onchoose) {
                entry.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    opts.onchoose(entry.choose());
                });
                entry.addEventListener("touchstart", (e) => {
                    e.preventDefault();
                    opts.onchoose(entry.choose());
                });
            }
            this.appendChild(entry);
            this.entries.push(entry);
        }
    }

    addWord(word) {
        // eslint-disable-next-line no-param-reassign
        word = word.trim();
        // eslint-disable-next-line prefer-destructuring
        const wordDict = this.wordDict;
        const originLength = word.length;
        // eslint-disable-next-line prefer-destructuring
        const length = word.length;
        for (let i = 0; i < length; i += 1) {
            const suffix = word.slice(0, i);
            const postfix = word.slice(i, originLength);
            const entry = wordDict.get(suffix);
            const newLink = { missing: postfix };
            if (entry) {
                let exist = false;
                const { links } = entry;
                // eslint-disable-next-line no-restricted-syntax
                for (const link of links) {
                    if (link.missing === postfix) {
                        exist = true;
                        break;
                    }
                }
                if (exist) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                links.push(newLink);
                // eslint-disable-next-line no-continue
                continue;
            }
            wordDict.set(suffix, { links: [newLink] });
        }
    }

    addHistory(command) {
        const originLength = command.length;
        for (let i = 0; i < command.length; i += 1) {
            const suffix = command.slice(0, i);
            const postfix = command.slice(i, originLength);
            const entry = this.historyDict.get(suffix);
            const newLink = { missing: postfix };
            if (!entry) {
                this.historyDict.set(suffix, { links: [newLink] });
                // eslint-disable-next-line no-continue
                continue;
            }
            let exist = false;
            const { links } = entry;
            // eslint-disable-next-line no-restricted-syntax
            for (const link of links) {
                if (link.missing === postfix) {
                    exist = true;
                    break;
                }
            }
            if (exist) {
                // eslint-disable-next-line no-continue
                continue;
            }
            links.push(newLink);
        }
    }

    build(tree) {
        const thiss = this;
        const ignoreWords = new Set(["execute"]);
        function dfs(pointer) {
            // eslint-disable-next-line no-restricted-syntax
            for (const key in pointer) {
                if (ignoreWords.has(key)) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                thiss.addWord(key);
                dfs(pointer[key]);
            }
        }
        dfs(tree);
    }

    /**
     *
     * @param {String[]} args
     * @param {String} typingValue
     * @returns
     */
    render(args, typingValue) {
        if (typingValue.match(/^\s*$/)) {
            return;
        }
        // start generate entries
        const links = [];
        const historyEntry = this.historyDict.get(typingValue);
        if (historyEntry) {
            links.push(...historyEntry.links);
        }
        const wordEntry = this.wordDict.get(args[args.length - 1]);
        if (!typingValue.endsWith(" ") && wordEntry) {
            links.push(...wordEntry.links);
        }
        const linkLength = links.length;
        let i = 0;
        while (i < this.maxEntryCount && i < linkLength) {
            const link = links[i];
            const completeValue = typingValue + link.missing;
            const entry = this.entries[i];
            entry.update(completeValue);
            entry.enable();
            entry.render();
            i += 1;
        }
        while (i < this.maxEntryCount) {
            const entry = this.entries[i];
            entry.disable();
            i += 1;
        }
        // make default select first entry
        this.selectingIndex = 0;
        const firstEntry = this.entries[0];
        firstEntry.getElement().classList.add("isSelecting");
    }

    reset() {
        // eslint-disable-next-line no-restricted-syntax
        for (const entry of this.entries) {
            entry.getElement().classList.remove("isSelecting");
            entry.disable();
        }
    }

    getSelectingEntry() {
        return this.entries[this.selectingIndex];
    }

    // ấn mũi tên lên xuống để chọn giá trị auto complete
    toggle(delta = 0) {
        const oldSelectingIndex = this.selectingIndex;
        const newSelectingIndex = oldSelectingIndex + delta;
        // checking new selecting element
        const newSelectingEntry = this.entries[newSelectingIndex];
        if (!newSelectingEntry || !newSelectingEntry.isEnable) {
            return;
        }
        newSelectingEntry.getElement().classList.add("isSelecting");
        this.selectingIndex = newSelectingIndex;
        // remove previous selecting index
        const oldSelectingEntry = this.entries[oldSelectingIndex];
        oldSelectingEntry?.getElement().classList.remove("isSelecting");
        // scroll selection to selecting entry
        const childStart = newSelectingEntry.offsetTop;
        // eslint-disable-next-line max-len
        const childEnd = childStart + parseFloat(getComputedStyle(newSelectingEntry.getElement()).height);
        const dadStart = this.element.scrollTop;
        const dadEnd = dadStart + parseFloat(getComputedStyle(this.element).height);
        if (childStart < dadStart) {
            this.element.scrollBy(0, childStart - dadStart);
        } else if (childEnd > dadEnd) {
            this.element.scrollBy(0, childEnd - dadEnd);
        }
    }

    // lấy giá trị đang select của auto complete và nhét vào TypingCommand value
    choose() {
        const entry = this.entries[this.selectingIndex];
        if (entry && entry.isEnable) {
            return entry.choose();
        }
        return null;
    }
}