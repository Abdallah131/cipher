import { useState } from "react";
import React from 'react';
import arrow from "../Assets/images/rightarrow.png"
import Swal from 'sweetalert2'

export default function Mono() {
    const [data , setData] = useState({
        Message : ""
    })
    const [analyse, setAnalyse] = useState(true)
    const [cryptState, setCryptState] = useState(false)
    const [mapping, setMapping] = useState(() => generateCipherMapping());
    const [fileContent, setFileContent] = useState("")
    const [originalText, setOriginal] = useState("")

    function redirect() {
        setData(prevData => ({
            ...prevData,
            shiftValue: ""
        }));
        setAnalyse(prevAnalyse => !prevAnalyse);
    }

    function handleChange(e) {
      const { name,value } = e.target;
      if (name === "textfile") {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  const fileContent = e.target.result;
                  setFileContent(fileContent);
              };
              reader.readAsText(file);
          }
      } else {
          setData(prevData => ({
              ...prevData,
              [name]: value
          }));
      }
  }

    function handleCrypt() {
        if (cryptState === false) {
          if(data.Message === "" && fileContent === "") {
            Swal.fire({
              title: 'Error!',
              text: 'Empty Message',
              icon: 'error',
              confirmButtonText: 'Continue',
            });
          } else {
            setOriginal(data.Message || fileContent)
            const ciphertext = encryptAlgorithm(data.Message || fileContent, mapping);
            setData((prevData) => ({
              ...prevData,
              Message: ciphertext,
            }));
            setCryptState((prevState) => !prevState);
          }
        } else {
          const decrypted = decrpytAlgorithm(data.Message || fileContent, mapping);
          setData((prevData) => ({
            ...prevData,
            Message: decrypted,
          }));
          setCryptState((prevState) => !prevState);
        }
      }

    function generateCipherMapping() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const shuffledAlphabet = [...alphabet].sort(() => Math.random() - 0.5);
        
        const mapping = {};
        for (let i = 0; i < alphabet.length; i++) {
            const letter = alphabet[i];
            const cipherSymbol = shuffledAlphabet[i];
            if (!mapping[letter]) {
            mapping[letter] = [];
            }
            mapping[letter].push(cipherSymbol);
        }
        return mapping;
    }
        function encryptAlgorithm(plaintext, mapping) {
        plaintext = plaintext.toUpperCase();
        let ciphertext = '';

        for (let i = 0; i < plaintext.length; i++) {
            const letter = plaintext[i];
            if (mapping[letter]) {
            ciphertext += mapping[letter][0];
            } else {
            ciphertext += letter;
            }
        }
        return ciphertext;
    }

        function decrpytAlgorithm(ciphertext, mapping) {
        let plaintext = '';

        for (let i = 0; i < ciphertext.length; i++) {
            const cryptedLetter = ciphertext[i];
            const letters = Object.keys(mapping).filter(letter => mapping[letter].includes(cryptedLetter));

            if (letters.length > 0) {
            plaintext += letters[0];
            } else {
            plaintext += cryptedLetter;
            }
        }

        return plaintext;
    }

    function handleCryptAnalyse() {
      if(!originalText) {
        if (data.Message || fileContent) {
          const cryptedText = (data.Message || fileContent).toUpperCase();
      
          const letterFrequencies = {};
          for (let i = 0; i < cryptedText.length; i++) {
            const letter = cryptedText[i];
            if (letter.match(/[A-Z]/)) {
              letterFrequencies[letter] = (letterFrequencies[letter] || 0) + 1;
            }
          }
      
          const englishFrequencies = {
            'E': 12000,
            'F': 2500,
            'T': 9000,
            'W': 2000,
            'Y': 2000,
            'A': 8000,
            'I': 8000,
            'N': 8000,
            'O': 8000,
            'S': 8000,
            'G': 1700,
            'P': 1700,
            'H': 6400,
            'B': 1600,
            'R': 6200,
            'V': 1200,
            'D': 4400,
            'K': 800,
            'L': 4000,
            'Q': 500,
            'U': 3400,
            'J': 400,
            'X': 400,
            'C': 3000,
            'M': 3000,
            'Z': 200
          };
      
          let totalLetters = 0;
          for (const letter in letterFrequencies) {
            totalLetters += letterFrequencies[letter];
          }
      
          const decryptionMap = {};
          for (const letter in letterFrequencies) {
            const observedFrequency = (letterFrequencies[letter] / totalLetters) * 100;
            let closestMatch = '';
            let closestDifference = Number.MAX_VALUE;
      
            for (const englishLetter in englishFrequencies) {
              const englishFrequency = englishFrequencies[englishLetter];
              const difference = Math.abs(englishFrequency - observedFrequency);
      
              if (difference < closestDifference) {
                closestDifference = difference;
                closestMatch = englishLetter;
              }
            }
      
            decryptionMap[letter] = closestMatch;
          }
      
          let decryptedText = '';
          for (let i = 0; i < cryptedText.length; i++) {
            const letter = cryptedText[i];
            if (letter.match(/[A-Z]/)) {
              decryptedText += decryptionMap[letter] || letter;
            } else {
              decryptedText += letter;
            }
          }
      
          setData((prevData) => ({
            ...prevData,
            Message: decryptedText,
          }));
          setCryptState((prevState) => !prevState);
        }
      }else {
        const mappingString = JSON.stringify(mapping, null, 2);
        Swal.fire(
          `Message Decrypted`,
          `Mapping:\n${mappingString}`,
          'success'
        )
        setData(prevData => {
          return {
            ...prevData,
            Message : originalText
          }
        })
      }
    }
    
    

    
  return (
    <div className='Main'>
        <div className='Container'>
            <br/>
            <div className="Header">
            <h1 style={{marginLeft:"130px"}}>MonoAlphabétique</h1>
            <img src={arrow} onClick={redirect} style={{marginLeft:"70px"}}/>
            </div>
            <br/><br/><br/><br/>
            <textarea
                placeholder='Message'
                onChange={handleChange}
                value={data.Message || fileContent}
                name = "Message"
            /><br/><br/>
            <input 
                style={{border:"none",marginLeft:"150px",width:"fit-content"}}
                type="file"
                id="myFile"
                name="textfile"
                onChange={handleChange}
             /><br/><br/>
            {analyse && <button onClick={handleCrypt}>{cryptState ? "DeCrypt" : "Crypt"} Message</button>}
            {!analyse && <button onClick={handleCryptAnalyse}>Cryptanalyse</button>}
        </div>
    </div>
  );
}


