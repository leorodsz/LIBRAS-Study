import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const letraCgesto = new GestureDescription ('Letra C');

// polegar
letraCgesto.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.50);
letraCgesto.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.75);
letraCgesto.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.75);


for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]){
    letraCgesto.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    letraCgesto.addDirection(finger, FingerDirection.VerticalUp, 0.75);
    letraCgesto.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.75);
    letraCgesto.addDirection(finger, FingerDirection.DiagonalDownRight, 0.75);
}
