// eslint-disable-next-line no-unused-vars
import BaseComponent from "../../global/components/base.component";

let currentMaxZIndex = 0;

/**
 * @param {BaseComponent} component
 */
export default function makeClickThenBringToFront(component) {
    component.addEventListener("mousedown", () => {
        const zIndex = currentMaxZIndex;
        component.style({ zIndex });
        currentMaxZIndex += 1;
    });
}
