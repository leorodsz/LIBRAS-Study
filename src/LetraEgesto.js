import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const letraEgesto = new GestureDescription ('Letra E');

// dedos dobrados
for (let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]){
    letraEgesto.addCurl(finger, FingerCurl.FullCurl, 1.0);
    letraEgesto.addDirection(finger, FingerDirection.VerticalUp, 0.75);
    letraEgesto.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.75);
    letraEgesto.addDirection(finger, FingerDirection.DiagonalDownRight, 0.75);
}

letraEgesto.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.5);
letraEgesto.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.5);