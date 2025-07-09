import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const letraIgesto = new GestureDescription ('Letra i');

// Mindinho (Pinky) esticado para cima
letraIgesto.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
letraIgesto.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
letraIgesto.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.75);
letraIgesto.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.75);

for (let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring]){
    letraIgesto.addCurl(finger, FingerCurl.FullCurl, 1.0);
    letraIgesto.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.25);
    letraIgesto.addDirection(finger, FingerDirection.DiagonalUpRight, 0.25);
}
