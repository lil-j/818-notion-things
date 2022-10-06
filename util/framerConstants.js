import {useSpring} from "framer-motion";

export const scaleX = (progress) => useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
});