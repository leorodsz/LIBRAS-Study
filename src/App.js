import React, { useRef, useState, useEffect } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from 'react-webcam';
import './App.css';
import { drawHand } from './utilitarios';
import * as fp from "fingerpose";
import { loveYouGesto } from './LoveYou';
import { letraLGesto } from './LetraLgesto';
import { letraAGesto } from './LetraAgesto';
import { letraCgesto } from './LetraCgesto';
import { letraEgesto } from './LetraEgesto';
import { letraIgesto } from './LetraIgesto';
import { letraOgesto } from './LetraOgesto';
import { hangLoose } from './suaveGesto';
import imagem from './img/img1.png'; // Certifique-se de que o caminho está correto



function App() {
  const WebcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [gesto, setGesto] = useState("");
  const [nome, setNome] = useState(""); // Estado para armazenar o nome do usuário

  useEffect(() => {
    const fetchUser = async () => {
      const nomeUsuario = await fetchUserByEmail();
      if (nomeUsuario) {
        setNome(nomeUsuario); // Atualiza o estado com o nome do usuário
      }
    };
    fetchUser();
    runHandpose();
  }, []);

  async function fetchUserByEmail() {
    const urlObj = new URL(window.location.href);
    const caminho = urlObj.pathname;
    const email = caminho.split('/').pop();
    const url = `https://localhost:7072/Cadastro/GetUser?email=${encodeURIComponent(email)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Usuário não encontrado');
          return null;
        } else {
          throw new Error('Erro ao buscar usuário');
        }
      }

      const data = await response.json();
      console.log(data);
      return data.nome;
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("modelo carregado.");
    setInterval(() => {
      detectar(net);
    }, 100);
  };

  const detectar = async (net) => {
    if (
      typeof WebcamRef.current !== "undefined" &&
      WebcamRef.current !== null &&
      WebcamRef.current.video.readyState === 4
    ) {
      const video = WebcamRef.current.video;
      const videoWidth = WebcamRef.current.video.videoWidth;
      const videoHeight = WebcamRef.current.video.videoHeight;

      WebcamRef.current.video.width = videoWidth;
      WebcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          loveYouGesto,
          letraLGesto,
          letraAGesto,
          letraCgesto,
          letraEgesto,
          letraIgesto,
          letraOgesto,
          hangLoose,
        ]);

        const gesture = await GE.estimate(hand[0].landmarks, 4.5);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          document.getElementById("gesto-detectado").innerHTML = gesture.gestures[0].name;
          console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          setGesto(gesture.gestures[maxConfidence]);
          console.log(gesto);
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  return (
    <div className="App">
      <p id="nome">{`Seja bem-vindo ${nome}`}</p>
      <header className="App-header">
        <div className="gesture-container">
          <h2>Gesto Detectado:</h2>
          <p id="gesto-detectado"></p>
        </div>
        <div className="camera-container">
          <Webcam ref={WebcamRef} className="webcam" />
          <canvas ref={canvasRef} className="canvas" />
        </div>
        <img src={imagem} alt="Descrição da imagem" className="imagem-abaixo-header" />
      </header>
     
    </div>
  );
}
export default App;