/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line prefer-destructuring */

// eslint-disable-next-line no-unused-vars
import BaseComponent from "../../global/components/base.component";
import makeDragToMoveWithMouse from "./make-drag-to-move-with-mouse";
import makeDragToMoveWithTouch from "./make-drag-to-move-with-touch";

/**
 * @param {BaseComponent} component
 * @param {BaseComponent} dragChild
 */
export default function makeDragToMove(component, dragChild, opts) {
    component.style({ position: "absolute" });
    makeDragToMoveWithMouse(component, dragChild, opts);
    makeDragToMoveWithTouch(component, dragChild, opts);
}
