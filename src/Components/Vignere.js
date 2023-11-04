import { useState } from "react";
import React from 'react';
import arrow from "../Assets/images/rightarrow.png";
import Swal from 'sweetalert2';

export default function Vigenere() {
    const [data, setData] = useState({
        Key: "",
        Message: ""
    });
    const [cryptState, setCryptState] = useState(false);
    const [analyse, setAnalyse] = useState(true);
    const [fileContent, setFileContent] = useState("");
    const [genkey, setKey] = useState("");

    function handleChange(e) {
        const { value, name } = e.target;

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
                   text: 'Empty Key',
                   icon: 'error',
                   confirmButtonText: 'Continue'
               })
           }
          }else {
            setKey(data.Key)
           const encryptedText = vigenereAlgoCrypt(data.Message || fileContent, data.Key);
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
               const decryptedText = vigenereAlgoDecrypt(data.Message || fileContent, data.Key);
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
            Key: ""
        }));
        setAnalyse(prevAnalyse => !prevAnalyse);
    }

    function handleCryptAnalyse() {
      const attempts = cryptanalyse(data.Message)
      console.log(attempts)
    }

    const [VIGNERE_SQUARE,setSquare] = useState({
      A: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    , B: "BCDEFGHIJKLMNOPQRSTUVWXYZA"
    , C: "CDEFGHIJKLMNOPQRSTUVWXYZAB"
    , D: "DEFGHIJKLMNOPQRSTUVWXYZABC"
    , E: "EFGHIJKLMNOPQRSTUVWXYZABCD"
    , F: "FGHIJKLMNOPQRSTUVWXYZABCDE"
    , G: "GHIJKLMNOPQRSTUVWXYZABCDEF"
    , H: "HIJKLMNOPQRSTUVWXYZABCDEFG"
    , I: "IJKLMNOPQRSTUVWXYZABCDEFGH"
    , J: "JKLMNOPQRSTUVWXYZABCDEFGHI"
    , K: "KLMNOPQRSTUVWXYZABCDEFGHIJ"
    , L: "LMNOPQRSTUVWXYZABCDEFGHIJK"
    , M: "MNOPQRSTUVWXYZABCDEFGHIJKL"
    , N: "NOPQRSTUVWXYZABCDEFGHIJKLM"
    , O: "OPQRSTUVWXYZABCDEFGHIJKLMN"
    , P: "PQRSTUVWXYZABCDEFGHIJKLMNO"
    , Q: "QRSTUVWXYZABCDEFGHIJKLMNOP"
    , R: "RSTUVWXYZABCDEFGHIJKLMNOPQ"
    , S: "STUVWXYZABCDEFGHIJKLMNOPQR"
    , T: "TUVWXYZABCDEFGHIJKLMNOPQRS"
    , U: "UVWXYZABCDEFGHIJKLMNOPQRST"
    , V: "VWXYZABCDEFGHIJKLMNOPQRSTU"
    , W: "WXYZABCDEFGHIJKLMNOPQRSTUV"
    , X: "XYZABCDEFGHIJKLMNOPQRSTUVW"
    , Y: "YZABCDEFGHIJKLMNOPQRSTUVWX"
    , Z: "ZABCDEFGHIJKLMNOPQRSTUVWXY"
  })

  function vigenereAlgoCrypt(text, key) {
    text = text.toUpperCase();
    key = key.toUpperCase();
    let encryptedText = "";

    // Iterate through the characters of the encrypted text and determine the key character for each position in the message.
    for (let i = 0; i < text.length; i++) {
      const textChar = text[i];
      const keyChar = key[i % key.length];
    // Encrypt the character in the plaintext using the Vigenère square and the corresponding key character.
      if (VIGNERE_SQUARE[textChar]) {
        const rowIndex = VIGNERE_SQUARE.A.indexOf(keyChar);
        const encryptedChar = VIGNERE_SQUARE[textChar][rowIndex];
        encryptedText += encryptedChar;
      } else {
        // If the character is not in the Vigenere square leave it unchanged.
        encryptedText += textChar;
      }
    }
    return encryptedText;
  }
  
  function vigenereAlgoDecrypt(encryptedText, key) {
    encryptedText = encryptedText.toUpperCase();
    key = key.toUpperCase();
    let decryptedText = "";

  // Iterate through the characters of the encrypted text and determine the key character for each position in the message.
    for (let i = 0; i < encryptedText.length; i++) {
      const encryptedChar = encryptedText[i];
      const keyChar = key[i % key.length];
  
      // Check if the character is a space and add it directly to the decrypted text
      if (encryptedChar === ' ') {
        decryptedText += ' ';
        continue;
      }
  

      // Use the Vigenère square to decrypt the character in the encrypted text using the corresponding key character.
      const rowIndex = VIGNERE_SQUARE.A.indexOf(keyChar);
      if (rowIndex !== -1) {
        for (const letter in VIGNERE_SQUARE) {
          if (VIGNERE_SQUARE[letter][rowIndex] === encryptedChar) {
            decryptedText += letter;
            break;
          }
        }
      } else {
        // If the character is not in the Vigenere square leave it unchanged.
        decryptedText += encryptedChar;
      }
    }
    return decryptedText;
  }
  
  
  function cryptanalyse(encryptedText) {
    const possibleKeyChars = 'abcdefghijklmnopqrstuvwxyz';
    const att = countLetterCombinations(encryptedText)
    console.log(att)
    let keyFound = false;
  
    for (let keyLength = 1; keyLength <= 10; keyLength++) {
      if (keyFound) {
        break;
      }
      // Generate the key combinations using the recursive functions and decrypt
      const keyCombinations = generateKeyCombinations(possibleKeyChars, keyLength);
      for (const key of keyCombinations) {
        const decryptedText = vigenereAlgoDecrypt(encryptedText, key);
        console.log(`Guessed Key (Length ${keyLength}): ${key}`);
        console.log(`Decrypted Text: ${decryptedText}`);
        console.log(`genkey: ${genkey}`);
        console.log(`key: ${key}`);
        if (key === genkey) {
          keyFound = true;
          Swal.fire(
            `Message Decrypted : ${decryptedText} `,
            `Key Value : ${key}`,
            'success'
          );
        }
      }
    }
  }
  
  // Function to generate all possible combinations of key of a given length
  function generateKeyCombinations(possibleChars, length) {
    const combinations = [];
    generateCombinationsRecursive('', possibleChars, length, combinations);
    return combinations;
  }
  
  function generateCombinationsRecursive(current, possibleChars, length, combinations) {
    if (current.length === length) {
      combinations.push(current);
      return;
    }
    for (const char of possibleChars) {
      generateCombinationsRecursive(current + char, possibleChars, length, combinations);
    }
  }
  
  function countLetterCombinations(text) {
    const letterCombinations = {}; // Use an object to store unique combinations
    let mostFrequentCombination = '';
    let maxCount = 0;
    let mostFrequentCombinationLength = 0;
  
    // Regular expression to match letter combinations of length 2-3
    const regex = /\b\w{2,3}\b/g;
  
    const matches = text.match(regex);
  
    if (matches) {
      matches.forEach(match => {
        const length = match.length;
        // Increment the count for each unique combination
        letterCombinations[match] = (letterCombinations[match] || 0) + 1;
        if (letterCombinations[match] > maxCount) {
          mostFrequentCombination = match;
          maxCount = letterCombinations[match];
          mostFrequentCombinationLength = length;
        }
      });
    }
  
    // Filter out combinations that appear only once
    const filteredCombinations = {};
    for (const combination in letterCombinations) {
      if (letterCombinations[combination] > 1) {
        filteredCombinations[combination] = letterCombinations[combination];
      }
    }
  
    // Format the output as "Facteur: résultat"
    const formattedOutput = {};
    for (const combination in filteredCombinations) {
      formattedOutput[`Facteur: ${combination}`] = filteredCombinations[combination];
    }
  
    return {
      mostFrequentCombinationLength: mostFrequentCombinationLength,
      combinations: formattedOutput
    };
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
                <br />
                <div className="Header">
                    <h1>Vigenere Cipher</h1>
                    <img src={arrow} onClick={redirect} />
                </div>
                <input
                    style={{ marginTop: "40px" }}
                    type='text'
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
                    name="Message"
                /><br /><br />
                <input
                    style={{ border: "none", marginLeft: "150px", width: "fit-content" }}
                    type="file"
                    id="myFile"
                    name="textfile"
                    onChange={handleChange}
                /><br /><br />
                {analyse && <button onClick={handleCrypt}>{cryptState ? "Decrypt" : "Encrypt"} Message</button>}
                {!analyse && <button onClick={handleCryptAnalyse}>Cryptanalysis</button>}
            </div>
        </div>
    );
}
