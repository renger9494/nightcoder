import Vue from "vue";
import breakpoints from "@/constants/breakpoints";

const changePosition = (state: any, { element, position }: { element: any, position: any }) => {
    breakpoints.forEach((breakpoint) => {
        if (!element.position) {
            Vue.set(element, position, {});
        }

        if (!position) {
            Vue.set(element.position, breakpoint, null);
            return;
        }
        if (!element.position[breakpoint])
            Vue.set(element.position, breakpoint, {});

        for (const key in position) {
            if (element.position[breakpoint][key] !== position[key]) {
                Vue.set(element.position[breakpoint], key, position[key]);
            }
        }
    })
}

export {
    changePosition
}