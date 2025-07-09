import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const loveYouGesto = new GestureDescription ('Eu te amo');

// polegar
loveYouGesto.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
loveYouGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.25);
loveYouGesto.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.25);

// dedo indicador
loveYouGesto.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
loveYouGesto.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);


// dedo mindinho
loveYouGesto.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
loveYouGesto.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.25);

for (let finger of [Finger.Middle, Finger.Ring]){
    loveYouGesto.addCurl(finger, FingerCurl.FullCurl, .75);
    loveYouGesto.addDirection(finger, FingerDirection.VerticalDown, .75)
}

