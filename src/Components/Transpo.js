import { useState } from "react";
import React from 'react';
import arrow from "../Assets/images/rightarrow.png"
import Swal from 'sweetalert2'

export default function Mono() {
    const [data , setData] = useState({
        Message : "",
        Key : null
    })
    const [analyse, setAnalyse] = useState(true)
    const [cryptState, setCryptState] = useState(false)
    const [fileContent, setFileContent] = useState("")
    const [genkey, setKey] = useState(null);


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
            const encrypted = TranspoEncrypt(data.Message || fileContent, data.Key);
            setKey(data.Key)
            setData((prevData) => ({
              ...prevData,
              Message: encrypted,
            }));
            setCryptState((prevState) => !prevState);
          }
        } else {
          const decrypted = TranspoDecrypt(data.Message || fileContent, data.Key);
          setData((prevData) => ({
            ...prevData,
            Message: decrypted,
          }));
          setCryptState((prevState) => !prevState);
        }
      }

      function TranspoEncrypt(plaintext, key) {
        let ciphertext = "";
        const numRows = Math.ceil(plaintext.length / key);
        const matrix = new Array(numRows);
    
        for (let i = 0; i < numRows; i++) {
            matrix[i] = new Array(key);
        }
    
        let charIndex = 0;
    
        for (let col = 0; col < key; col++) {
            for (let row = 0; row < numRows; row++) {
                if (charIndex < plaintext.length) {
                    matrix[row][col] = plaintext[charIndex];
                    charIndex++;
                }
            }
        }
    
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < key; col++) {
                if (matrix[row][col] !== undefined) {
                    ciphertext += matrix[row][col];
                }
            }
        }
    
        return ciphertext;
    }

      function TranspoDecrypt(ciphertext, key) {
        let plaintext = "";
        const numRows = Math.ceil(ciphertext.length / key);
        const matrix = new Array(numRows);

        for (let i = 0; i < numRows; i++) {
            matrix[i] = new Array(key);
        }

        let charIndex = 0;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < key; col++) {
                if (charIndex < ciphertext.length) {
                    matrix[row][col] = ciphertext[charIndex];
                    charIndex++;
                }
            }
        }

        for (let col = 0; col < key; col++) {
            for (let row = 0; row < numRows; row++) {
                if (matrix[row][col] !== undefined) {
                    plaintext += matrix[row][col];
                }
            }
        }

        return plaintext;
}
  
  function handleCryptAnalyse() {
    const attempts = cryptanalyse(data.Message)
    console.log(attempts)
  }
  function cryptanalyse(cryptedtext) {
    if (cryptedtext === "") {
        Swal.fire({
            title: 'Error!',
            text: 'Empty Message',
            icon: 'error',
            confirmButtonText: 'Continue',
        });
        return;
    }

    const ciphertext = cryptedtext;
    let potentialMessages = [];

    for (let key = 2; key <= 20; key++) {
        const potentialDecryption = TranspoDecrypt(ciphertext, key);

        console.log(`Key : ${key}: Message : ${potentialDecryption}`);
        console.log(genkey)
        if(genkey == key) {
          Swal.fire(
            `Message Decrypted : ${potentialDecryption} `,
            `Key Value : ${key}`,
            'success'
          );
        }
        potentialMessages.push({
            key,
            message: potentialDecryption,
        });
    }
  }

  async function isEnglishWord(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
    
    
  return (
    <div className='Main'>
        <div className='Container'>
            <br/>
            <div className="Header">
            <h1 style={{marginLeft:"130px"}}>Transpoistion Cipher</h1>
            <img src={arrow} onClick={redirect} style={{marginLeft:"50px"}}/>
            </div>
            <input
                    style={{ marginTop: "40px" }}
                    type='number'
                    placeholder='Key'
                    required
                    onChange={handleChange}
                    value={data.Key}
                    name="Key"
                    disabled={cryptState}
                /><br /><br />
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


