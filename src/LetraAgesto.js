import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const letraAGesto = new GestureDescription ('Letra A');

// polegar
letraAGesto.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letraAGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.75);
letraAGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.75);

for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky, Finger.Index]){
    letraAGesto.addCurl(finger, FingerCurl.FullCurl, 1.0);
    letraAGesto.addDirection(finger, FingerDirection.VerticalDown, 1.0)
}
