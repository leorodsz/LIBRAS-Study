import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

// Criando uma nova descrição de gesto para "Hang Loose"
export const hangLoose = new GestureDescription('De boa');

// Polegar - esticado, apontando para a esquerda ou direita (dependendo da mão)
hangLoose.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
hangLoose.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 1.0);
hangLoose.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 1.0);

// Mindinho - esticado, apontando para cima ou diagonal
hangLoose.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
hangLoose.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
hangLoose.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.75);
hangLoose.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.75);

// Dedo indicador, médio e anelar - dobrados
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
    hangLoose.addCurl(finger, FingerCurl.FullCurl, 1.0);
    hangLoose.addDirection(finger, FingerDirection.VerticalDown, 0.75);
}