import { 
    DISPLAY,
    SHOW_ANIMATION,
    FOCUS_ON, 
} from './types';

export const display = (component) => ({
    type: DISPLAY,
    component,
});

export const showAnimation = (bool) => ({
    type: SHOW_ANIMATION,
    bool
})

export const focusOn = (focus) => ({
    type: FOCUS_ON,
    focus
})
