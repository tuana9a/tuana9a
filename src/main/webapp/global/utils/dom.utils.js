import BaseComponent from "../components/base.component";

const ddocument = new BaseComponent(window.document);

export function document() {
    return ddocument;
}

const bbody = new BaseComponent(document().getElement().body);

export function body() {
    return bbody;
}

export function dce(tagName) {
    return document().getElement().createElement(tagName);
}

export function dct(tagName) {
    return document().getElement().createTextNode(tagName);
}
