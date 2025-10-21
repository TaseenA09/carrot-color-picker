export let Mouse = { x: null, y: null }

export function UpdateMousePosition(event) {
    Mouse.x = event.clientX ?? event.touches[0].clientX;
    Mouse.y = event.clientY ?? event.touches[0].clientY;
}
