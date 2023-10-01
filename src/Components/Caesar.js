import { useState } from "react";
import React from 'react';
import arrow from "../Assets/images/rightarrow.png"
import Swal from 'sweetalert2'

export default function Caesar() {
    const [data , setData] = useState({
        shiftValue : null,
        Message : ""
    })
    const [cryptState, setCryptState] = useState(false)
    const [analyse, setAnalyse] = useState(true)
    const [fileContent, setFileContent] = useState("")
    
    function handleChange(e) {
      const { value, name } = e.target;
      const newValue = name === "shiftValue" ? parseInt(value, 10) : value;

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
              [name]: newValue
          }));
      }
  }
    
    function handleCrypt() {
       if(cryptState === false ) {
        if(data.Message === "" && fileContent === "") {
          Swal.fire({
            title: 'Error!',
            text: 'Empty Message',
            icon: 'error',
            confirmButtonText: 'Continue'
        })
            if(!data.shiftValue){
                Swal.fire({
                    title: 'Error!',
                    text: 'Empty Value',
                    icon: 'error',
                    confirmButtonText: 'Continue'
                })
            }
           }else {
            const encryptedText = cesarAlgo(data.Message || fileContent, data.shiftValue);
            setData(prevData => {
                return {
                    ...prevData,
                    Message : encryptedText
                }
            })
            setCryptState(prevState => !prevState)
           }
       }else {
        if(data.Message === "" && fileContent === "") {
            Swal.fire({
                title: 'Error!',
                text: 'Empty Message',
                icon: 'error',
                confirmButtonText: 'Continue'
            })
           }else {
                const decryptedText = cesarAlgo(data.Message || fileContent, -data.shiftValue);
                setData(prevData => {
                    return {
                        ...prevData,
                        Message : decryptedText
                    }
                })
                setCryptState(prevState => !prevState)
           }
       }
    }
    
    function redirect() {
        setData(prevData => ({
            ...prevData,
            shiftValue: ""
        }));
        setAnalyse(prevAnalyse => !prevAnalyse);
    }
    
    function handleCryptAnalyse() {
        if(data.Message === "") {

        } else {
            const decryptionAttempts = cryptanalyse(data.Message);
            console.log(decryptionAttempts);
        }
    }
    function cesarAlgo(text, n) {
        let result = '';
      
        for (let i = 0; i < text.length; i++) {
          let char = text.charAt(i);
      
          if (/[a-zA-Z]/.test(char)) {
            const isUpperCase = char   === char.toUpperCase();
            const alphabetStart = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            const newCharCode = ((char.charCodeAt(0) - alphabetStart + n + 26) % 26) + alphabetStart;
            const shiftedChar = String.fromCharCode(newCharCode);
            result += shiftedChar;
          } else {
              // if its not a letter we keep it as it is
            result += char;
          }
        }
        return result;
      }
      
      function cryptanalyse(text) {
        let decryptedText = '';

        for (let shift = 1; shift <= 25; shift++) {
          let currentAttempt = '';
          for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            if (/[a-zA-Z]/.test(char)) {
              const isUpperCase = char === char.toUpperCase();
              const alphabetStart = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
              const newCharCode = ((char.charCodeAt(0) - alphabetStart - shift + 26) % 26) + alphabetStart;
              const shiftedChar = String.fromCharCode(newCharCode);
              currentAttempt += shiftedChar;
            } else {
              currentAttempt += char;
            }
          }
          decryptedText += `Attempt ${shift}: ${currentAttempt}\n`;
          const words = currentAttempt.split(/\s+/);
          const firstWord = words[0];
        isEnglishWord(firstWord)
        .then(isValid => {
            if (isValid) {
                Swal.fire(
                    `Message Decrypted : ${currentAttempt} `,
                    `Shift Value : ${shift}`,
                    'success'
                  )
            } else {
            }
            });
        }
      
        return decryptedText;
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
            <h1>Caesar’s Cipher</h1>
            <img src={arrow} onClick={redirect}/>
            </div>
            <input
                style={{marginTop:"40px"}}
                type='number'
                min={1}
                max={25}
                placeholder='Shift Value (1..25)'
                required
                onChange={handleChange} 
                value={data.shiftValue}
                name = "shiftValue"
                disabled = {cryptState}
            /><br/><br/>
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


