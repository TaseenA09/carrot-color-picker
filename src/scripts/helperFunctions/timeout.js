let TimeoutsArray = []
let TimeoutOverflowArray = []

const TimeoutOverflowMax = 15;

export function DoTimeout(TimeoutId, funtionToDo, timeToWait) {
    TimeoutOverflowArray[TimeoutId] = isNaN(TimeoutOverflowArray[TimeoutId]) ? 0 : TimeoutOverflowArray[TimeoutId];

    clearTimeout(TimeoutsArray[TimeoutId]);

    if (TimeoutOverflowArray[TimeoutId] >= TimeoutOverflowMax || timeToWait == 0) {
        funtionToDo();
        TimeoutOverflowArray[TimeoutId] = 0;
    } else {
        TimeoutsArray[TimeoutId] = setTimeout(() => { funtionToDo(); TimeoutOverflowArray[TimeoutId] = 0; }, timeToWait);
    }

    TimeoutOverflowArray[TimeoutId] += 1;
}
