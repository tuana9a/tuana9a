/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line prefer-destructuring */

// eslint-disable-next-line no-unused-vars
import BaseComponent from "../../global/components/base.component";

/**
 * @param {BaseComponent} component
 * @param {BaseComponent} dragChild
 */
export default function makeDragToMoveWithTouch(component, dragChild, opts) {
    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;
    function touchstart(e) {
        // e.preventDefault();//EXPLAIN: nếu prevent thì click bị chặn
        // get the mouse cursor position at startup:
        oldX = e.touches[0].clientX;
        oldY = e.touches[0].clientY;
        document.addEventListener("touchend", touchend);
        document.addEventListener("touchmove", touchmove, { passive: false });
    }
    function touchmove(e) {
        e.preventDefault();
        // calculate delta from previous position
        deltaX = e.touches[0].clientX - oldX;
        deltaY = e.touches[0].clientY - oldY;
        // calculate the new cursor position
        oldX = e.touches[0].clientX;
        oldY = e.touches[0].clientY;
        // set the element's new position
        const element = component.getElement();
        let newX = element.offsetLeft + deltaX;
        let newY = element.offsetTop + deltaY;
        if (opts?.boundComponent) {
            const { boundComponent } = opts;
            const boundElement = boundComponent.getElement();
            const minX = 0;
            const minY = 0;
            const maxX = boundElement.offsetWidth;
            const maxY = boundElement.offsetHeight;
            if (element.offsetLeft + element.offsetWidth + deltaX > maxX) {
                newX = maxX - element.offsetWidth;
            }
            if (element.offsetTop + element.offsetHeight + deltaY > maxY) {
                newY = maxY - element.offsetHeight;
            }
            if (element.offsetLeft + deltaX < minX) {
                newX = minX;
            }
            if (element.offsetTop + deltaY < minY) {
                newY = minY;
            }
        }
        component.style({ top: `${newY}px`, left: `${newX}px` });
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
