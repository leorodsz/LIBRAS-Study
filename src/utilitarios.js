// pontos dos dedos
const fingerJoints = {
    thumb: [0,1,2,3,4],
    indexFinger: [0,5,6,7,8],
    middleFinger: [0,9,10,11,12],
    ringFinger: [0,13,14,15,16],
    pinky: [0,17,18,19,20],
};

// função dos pontos da mão
export const drawHand = (predictions, ctx) =>{
        if(predictions.length>0){
            predictions.forEach((prediction) => {
              
              
                const landmarks = prediction.landmarks;
                for (let j = 0; j < Object.keys(fingerJoints).length; j++){
                    let finger = Object.keys(fingerJoints)[j];

                    for (let k = 0; k<fingerJoints[finger].length -1; k++){

                        const firstJoinIndex = fingerJoints [finger] [k];
                        const secondJoinIndex = fingerJoints [finger] [k+1];

                        ctx.beginPath();
                        ctx.moveTo(
                            landmarks[firstJoinIndex] [0],
                            landmarks[firstJoinIndex] [1]
                        );
                        ctx.lineTo(
                            landmarks [secondJoinIndex] [0],
                            landmarks [secondJoinIndex] [1]
                        );
                        ctx.strokeStyle = "plum";
                        ctx.lineWidth = 4;
                        ctx.stroke();
                    } 
                }

                for (let i=0; i<landmarks.length; i++ ){
                  
                    // ponto x
                    const x = landmarks [i] [0];
                    // ponto y 
                    const y = landmarks [i] [1];

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 3 * Math.PI);

                    ctx.fillStyle = "indigo";
                    ctx.fill();
                }
            });
        } 
}