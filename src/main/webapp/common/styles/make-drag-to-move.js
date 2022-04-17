/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line prefer-destructuring */

// eslint-disable-next-line no-unused-vars
import BaseComponent from "../../global/components/base.component";

class Bind {
    constructor(oldX = 0, oldY = 0, deltaX = 0, deltaY = 0, newX = 0, newY = 0) {
        this.oldX = oldX;
        this.oldY = oldY;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.newX = newX;
        this.newY = newY;
    }
}

/**
 * @param {Bind} bind
 * @param {BaseComponent} component
 * @param {BaseComponent} dragChild
 */
export function makeMouseDragToMove(bind, component, dragChild) {
    function mousedown(e) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        bind.oldX = e.clientX;
        bind.oldY = e.clientY;
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
    }
    function mousemove(e) {
        e.preventDefault();
        // caculate delta from previos
        const clientX = e.clientX;
        const clientY = e.clientY;
        bind.deltaX = clientX - bind.oldX;
        bind.deltaY = clientY - bind.oldY;
        // calculate the new cursor position
        bind.oldX = clientX;
        bind.oldY = clientY;
        // set the element's new position
        bind.newX = component.getElement().offsetLeft + bind.deltaX;
        bind.newY = component.getElement().offsetTop + bind.deltaY;
        component.style({ top: `${bind.newY}px`, left: `${bind.newX}px` });
    }
    function mouseup() {
        // stop moving when mouse button is released:
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    }
    if (dragChild) {
        // if present, the header is where you move the DIV from:
        dragChild.addEventListener("mousedown", mousedown);
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        component.addEventListener("mousedown", mousedown);
    }
}

/**
 * @param {Bind} bind
 * @param {BaseComponent} component
 * @param {BaseComponent} dragChild
 */
export function makeTouchDragToMove(bind, component, dragChild) {
    function touchstart(e) {
        // e.preventDefault();//EXPLAIN: nếu prevent thì click bị chặn
        // get the mouse cursor position at startup:
        bind.oldX = e.touches[0].clientX;
        bind.oldY = e.touches[0].clientY;
        document.addEventListener("touchend", touchend);
        document.addEventListener("touchmove", touchmove, { passive: false });
    }
    function touchmove(e) {
        e.preventDefault();
        // calculate delta from previous position
        bind.deltaX = e.touches[0].clientX - bind.oldX;
        bind.deltaY = e.touches[0].clientY - bind.oldY;
        // calculate the new cursor position
        bind.oldX = e.touches[0].clientX;
        bind.oldY = e.touches[0].clientY;
        // set the element's new position
        bind.newX = component.getElement().offsetLeft + bind.deltaX;
        bind.newY = component.getElement().offsetTop + bind.deltaY;
        component.style({ top: `${bind.newY}px`, left: `${bind.newX}px` });
    }
    function touchend() {
        // stop moving when mouse button is released:
        document.removeEventListener("touchmove", touchmove);
        document.removeEventListener("touchend", touchend);
    }
    if (dragChild) {
        // if present, the header is where you move the DIV from:
        dragChild.addEventListener("touchstart", touchstart, { passive: false });
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        component.addEventListener("touchstart", touchstart, { passive: false });
    }
}

/**
 * @param {BaseComponent} component
 * @param {BaseComponent} dragChild
 * @param {*} opts
 */
export default function makeDragToMove(component, dragChild, opts) {
    const bind = new Bind();
    component.style({ position: "absolute" });
    makeMouseDragToMove(bind, component, dragChild, opts);
    makeTouchDragToMove(bind, component, dragChild, opts);
}
