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


