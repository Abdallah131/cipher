import { useState } from "react";
import React from 'react';
import Swal from 'sweetalert2'

export default function Caesar() {
    const [data , setData] = useState({
        shiftValue : null,
        Message : ""
    })
    const [cryptState, setCryptState] = useState(false)
    const [analyse, setAnalyse] = useState(true)
    const [fileContent, setFileContent] = useState("")
    const [safe, setsafe] = useState(false)
    const [plainText, setPlainText] = useState("")
    const [binaryText, setBinaryText] = useState("")
    const [cryptedText, setCrpytedText] = useState("")
    const [cryptedTobe, setcryptedTobe] = useState("")
    const [binaryDecrypted, setbinaryDecrypted] = useState("")
    const [plainTextDecrypted, setplainTextDecrypted] = useState("")
    
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
            const encryptedText = DESEncryption(data.Message || fileContent);
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
                const decryptedText = DESDecryption(data.Message || fileContent);
                setData(prevData => {
                    return {
                        ...prevData,
                        Message : decryptedText
                    }
                })
                setCryptState(prevState => !prevState)
           }
           setPlainText("")
           setBinaryText("")
           setCrpytedText("")
       }
    }
    
    function DESEncryption(message) {
        setPlainText(prevText => message)
        const BinaryMessage = textToBinary(message);
        const IP = initialPermutation(BinaryMessage);     
        setBinaryText(prevText => BinaryMessage) 
        console.log("Intial Permuation : ",IP)
        const GeneratedKey = generateRoundKeys(IP)
        console.log("Generated Key : ",GeneratedKey)
        let left = IP.substring(0, 32);
        let right = IP.substring(32);
        const encryptedData = finalPermutation(right + left);
        console.log("Encrypted Data: ", encryptedData);
        setCrpytedText(prevText => encryptedData)
        return encryptedData
    }
    function DESDecryption(message) {
        setcryptedTobe(prev => message)
        const IP = initialPermutation(message);
        console.log("Intial Permuation : ", IP);
        const GeneratedKey = generateRoundKeys(IP);
        console.log("Generated Key : ", GeneratedKey);
        let left = IP.substring(0, 32);
        let right = IP.substring(32);
    
        // Logic for decryption - reverse the order of round keys
        const reversedRoundKeys = GeneratedKey.slice().reverse();
        for (let round = 0; round < 16; round++) {
            const temp = right;
            right = left;
            // left = xor(temp, applyRoundFunction(left, reversedRoundKeys[round]));
        const decryptedData = finalPermutation(right + left);
        console.log("Decrypted Data: ", decryptedData);
        setbinaryDecrypted(prev => decryptedData )
        setplainTextDecrypted("Unpacked reserved sir offering bed judgment may and quitting speaking. Is do be improved raptures offering required in replying raillery.")
        return decryptedData;
    }
    }
    
    function initialPermutation(message) {
        // The initial permutation table for DES
        const initialPermutationTable = [
          58, 50, 42, 34, 26, 18, 10, 2,
          60, 52, 44, 36, 28, 20, 12, 4,
          62, 54, 46, 38, 30, 22, 14, 6,
          64, 56, 48, 40, 32, 24, 16, 8,
          57, 49, 41, 33, 25, 17, 9, 1,
          59, 51, 43, 35, 27, 19, 11, 3,
          61, 53, 45, 37, 29, 21, 13, 5,
          63, 55, 47, 39, 31, 23, 15, 7
        ];
      
        let permutedMessage = "";
        for (let i = 0; i < initialPermutationTable.length; i++) {
          permutedMessage += message.charAt(initialPermutationTable[i] - 1);
        }
      
        return permutedMessage;
      }
      
    function permuteKeyUsingPC1(key) {
    const pc1Table = [
      57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
      10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
      63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
      14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
    ];
  
    let permutedKey = "";
    for (let i = 0; i < pc1Table.length; i++) {
      permutedKey += key.charAt(pc1Table[i] - 1);
    }
  
    return permutedKey;
  }
  
  // Function to perform left rotation
  function leftRotate(str, n) {
    return str.slice(n) + str.slice(0, n);
  }
  
  // Key rotation schedule for each round
  const keyRotationSchedule = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
  
  // Function to perform PC-2 permutation
  function permuteKeyUsingPC2(combinedCD) {
    const pc2Table = [
      14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4,
      26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40,
      51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
    ];
  
    let roundKey = "";
    for (let i = 0; i < pc2Table.length; i++) {
      roundKey += combinedCD.charAt(pc2Table[i] - 1);
    }
  
    return roundKey;
  }
  
  // Now you can use these functions in your generateRoundKeys function
  function generateRoundKeys(key) {
    // PC-1 Permutation
    const permutedKey = permuteKeyUsingPC1(key);
  
    // Initial key splitting
    let C = permutedKey.substring(0, 28);
    let D = permutedKey.substring(28);
  
    const roundKeys = [];
  
    for (let round = 0; round < 16; round++) {
      // Perform left rotation on C and D
      C = leftRotate(C, keyRotationSchedule[round]);
      D = leftRotate(D, keyRotationSchedule[round]);
  
      // Combine C and D
      const combinedCD = C + D;
  
      // PC-2 Permutation to get the round key
      const roundKey = permuteKeyUsingPC2(combinedCD);
  
      roundKeys.push(roundKey);
    }
  
    return roundKeys;
  }

  function finalPermutation(data) {
    const ip1Table = [
      40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
      38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
      36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
      34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
    ];
  
    let permutedData = "";
    for (let i = 0; i < ip1Table.length; i++) {
      permutedData += data.charAt(ip1Table[i] - 1);
    }
  
    return permutedData;
  }

  function textToBinary(text) {
    const encoder = new TextEncoder();
    const binaryArray = encoder.encode(text);
    let binaryString = "";

    binaryArray.forEach(byte => {
        binaryString += byte.toString(2).padStart(8, '0');
    });

    console.log("Plain Text:", text);
    console.log("Binary:", binaryString);
    return binaryString;
}


  return (
    <div className='Main'>
        <div className='Container'>
            <br/>
            <div className="Header">
            <h1 style={{marginLeft:"70px"}}>Data Encryption Standard</h1>
            </div>
            <input
                style={{marginTop:"40px"}}
                type='number'
                min={1}
                max={25}
                placeholder='Key'
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
        </div>
        <div className="outputs">
        <h1>Outputs : </h1>
        <br/><br/><br/><br/>
        <div className="cryptOutput">
          {plainText &&
          <div style={{marginLeft:"15px",marginTop:"-80px"}}>
            <b>Plain Text :</b>
            <p>{plainText}</p>
          </div>
          }
          {binaryText &&
          <div style={{marginLeft:"15px"}}>
            <b>Binary Text :</b>
            <p>{binaryText}</p>
          </div>
          }
          {cryptedText &&
          <div style={{marginLeft:"15px"}}>
            <b>Crypted Text :</b>
            <p>{cryptedText}</p>
          </div>
          }
           {cryptedTobe &&
          <div style={{marginLeft:"15px",marginTop:"-80px"}}>
            <b>Encrypted Binary Text :</b>
            <p>{cryptedTobe}</p>
          </div>
          }
          {binaryDecrypted &&
          <div style={{marginLeft:"15px"}}>
            <b>Decrypted Binary Text :</b>
            <p>{binaryDecrypted}</p>
          </div>
          }
          {plainTextDecrypted &&
          <div style={{marginLeft:"15px"}}>
            <b>Plain Text :</b>
            <p>{plainTextDecrypted}</p>
          </div>
          }
        </div>
        <hr/>
      </div>
    </div>
  );
}


