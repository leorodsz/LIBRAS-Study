import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";


export const letraLGesto = new GestureDescription ('Letra L');

// polegar
letraLGesto.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
letraLGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.75);
letraLGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.75);
letraLGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.5);
letraLGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.5);

// dedo indicador
letraLGesto.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
letraLGesto.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);

for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]){
    letraLGesto.addCurl(finger, FingerCurl.FullCurl, 0.75);
    letraLGesto.addDirection(finger, FingerDirection.VerticalDown, 1.0)
}