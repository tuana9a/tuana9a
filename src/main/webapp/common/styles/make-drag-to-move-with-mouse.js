/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line prefer-destructuring */

// eslint-disable-next-line no-unused-vars
import BaseComponent from "../../global/components/base.component";
import { document } from "../../global/utils/dom.utils";

/**
 * @param {BaseComponent} component
 * @param {BaseComponent} dragComponent
 */
export default function makeDragToMoveWithMouse(component, dragComponent, opts) {
    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let isDragging = false;

    const mousedown = (e) => {
        e.preventDefault();
        // get the mouse cursor position at startup:
        oldX = e.clientX;
        oldY = e.clientY;
        isDragging = true;
    };

    const mousemove = (e) => {
        if (!isDragging) {
            return;
        }

        e.preventDefault();
        // caculate delta from previos
        const clientX = e.clientX;
        const clientY = e.clientY;
        deltaX = clientX - oldX;
        deltaY = clientY - oldY;
        // calculate the new cursor position
        oldX = clientX;
        oldY = clientY;
        // set the element's new position
        const element = component.getElement();
        // eslint-disable-next-line max-len
        let newX = element.offsetLeft + deltaX;
        let newY = element.offsetTop + deltaY;
        if (opts?.boundComponent) {
            const { boundComponent } = opts;
            const boundElement = boundComponent.getElement();
            const minX = 0;
            const minY = 0;
            const maxX = boundElement.offsetWidth;
            const maxY = boundElement.offsetHeight;
            if (opts.boundRight) {
                if (element.offsetLeft + element.offsetWidth + deltaX > maxX) {
                    newX = maxX - element.offsetWidth;
                }
            }
            if (opts.boundBottom) {
                if (element.offsetTop + element.offsetHeight + deltaY > maxY) {
                    newY = maxY - element.offsetHeight;
                }
            }
            if (opts.boundLeft) {
                if (element.offsetLeft + deltaX < minX) {
                    newX = minX;
                }
            }
            if (opts.boundTop) {
                if (element.offsetTop + deltaY < minY) {
                    newY = minY;
                }
            }
        }
        component.style({ top: `${newY}px`, left: `${newX}px` });
    };

    const mouseup = () => {
        // stop moving when mouse button is released:
        isDragging = false;
    };

    dragComponent.addEventListener("mousedown", mousedown);

    document().addEventListener("mousemove", mousemove);
    component.addNotifyListener("remove", () => document().removeEventListener("mousemove", mousemove));

    document().addEventListener("mouseup", mouseup);
    component.addNotifyListener("remove", () => document().removeEventListener("mouseup", mouseup));
}
