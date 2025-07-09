import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const letraOgesto = new GestureDescription('Letra O');

// Polegar levemente curvado
letraOgesto.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
letraOgesto.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75);
letraOgesto.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75);

// Todos os outros dedos (Indicador, Médio, Anelar, Mínimo) levemente curvados
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    letraOgesto.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    letraOgesto.addDirection(finger, FingerDirection.VerticalUp, 0.75);
    letraOgesto.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.75);
    letraOgesto.addDirection(finger, FingerDirection.DiagonalUpRight, 0.75);
}
