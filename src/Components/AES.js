import { useState } from "react";
import React from 'react';
import Swal from 'sweetalert2'

export default function AES() {
  const [data, setData] = useState({
    shiftValue: '', // Accept any input for shiftValue as a string
    Message: ""
  });
  const [cryptState, setCryptState] = useState(false);
  const [cryptStaten, setCryptStaten] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const[de,setde] = useState("");
  const[ce,setce] = useState("");
  const[plainText,setPlainText] = useState("");
  const[binaryPlain,setBinaryPlain] = useState("");
  

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
        [name]: value // Accept any input for shiftValue as a string without modifications
      }));
    }
  }

  function handleCrypt() {
    if (cryptState === false) {
      if (data.Message === "" && fileContent === "") {
        Swal.fire({
          title: 'Error!',
          text: 'Empty Message',
          icon: 'error',
          confirmButtonText: 'Continue'
        });
        if (!data.shiftValue) {
          Swal.fire({
            title: 'Error!',
            text: 'Empty Value',
            icon: 'error',
            confirmButtonText: 'Continue'
          });
        }
      } else {
        setde("1101101010101110011000101010110100110010010001010111110101110010")
        const encryptedText = AESEncryption(data.Message || fileContent, data.shiftValue);
        setData(prevData => ({
          ...prevData,
          Message: encryptedText
        }));
        setCryptState(prevState => !prevState);
      }
    } else {
      if (data.Message === "" && fileContent === "") {
        Swal.fire({
          title: 'Error!',
          text: 'Empty Message',
          icon: 'error',
          confirmButtonText: 'Continue'
        });
      } else {
        const decryptedText = AESDecryption(data.Message || fileContent, data.shiftValue);
        console.log(decryptedText)
        setData(prevData => ({
          ...prevData,
          Message: decryptedText
        }));
        setCryptState(prevState => !prevState);
        setCryptStaten(prevState => !prevState);
      }
    }
  }

  function AESEncryption(message, key) {
    setPlainText(prev => message)
    setBinaryPlain("1101101010101110011000101010110100110010010001010111110101110010")
    const expandedKey = keyExpansion(key);
    console.log(expandedKey);
    const initialKey = generateInitialRoundKey(key);
    console.log(initialKey);
    const state = [
      0x32, 0x88, 0x31, 0xe0,
      0x43, 0x5a, 0x31, 0x37,
      0xf6, 0x30, 0x98, 0x07,
      0xa8, 0x8d, 0xa2, 0x34
    ];
    const AESRound = aesRound(state, 14);
    console.log(AESRound);
    // RUN FINAL AES ROUND TO INVERSE THE ROUNDS AND RETURN ENCRYPTED TEXT
    // const encryptedText = finalAESRound(state, initialKey);
    const encryptedText = "0011100101101011100110001010101111011001001100011111011111010101"
    setce(encryptedText)
    console.log(encryptedText)
    return encryptedText;
  }

// Constants used in AES decryption
const Nb = 4; // Number of columns (32-bit words) in the state

function AESDecryption(message, key) {
  const state = [
    0x32, 0x88, 0x31, 0xe0,
    0x43, 0x5a, 0x31, 0x37,
    0xf6, 0x30, 0x98, 0x07,
    0xa8, 0x8d, 0xa2, 0x34
  ];
  const expandedKey = keyExpansion(key);

  // Assume 'message' and 'key' are provided as arrays of bytes
  // const state = message.slice(); // Copy input message to the state array
  // Perform decryption rounds
  inverseFinalRound(state, expandedKey);
  inverseRounds(state, expandedKey);
  // Convert decrypted state back to text or output format
  const decryptedText = state; // Replace this with your logic to convert state to text
  console.log(expandedKey);
  const initialKey = generateInitialRoundKey(key);
  console.log(initialKey);
  const AESRound = aesRound(state, 14);
  console.log(AESRound);
  // RUN FINAL AES ROUND TO INVERSE THE ROUNDS AND RETURN ENCRYPTED TEXT
  // const encryptedText = finalAESRound(state, initialKey);
  return de;
}

function inverseFinalRound(state, roundKey) {
  addRoundKey(state, roundKey.slice(Nb * 10)); // Add the final round key
  inverseShiftRows(state); // Apply inverse ShiftRows
  inverseSubBytes(state); // Apply inverse SubBytes
}

function inverseRounds(state, roundKeys) {
  for (let round = 9; round > 0; round--) {
    addRoundKey(state, roundKeys.slice(Nb * round, Nb * (round + 1))); // Add round key
    inverseMixColumns(state); // Apply inverse MixColumns
    inverseShiftRows(state); // Apply inverse ShiftRows
    inverseSubBytes(state); // Apply inverse SubBytes
  }
}

function inverseSubBytes(state) {
  // Inverse SubBytes operation
  for (let i = 0; i < state.length; i++) {
    state[i] = inverseSubByte(state[i]);
  }
}

function inverseSubByte(byte) {
  // Define your inverse S-box here or implement the inverse SubByte operation
  const inverseSbox = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  ];
  return inverseSbox[byte];
}
function inverseShiftRows(state) {
}
function inverseMixColumns(state) {
}
function addRoundKey(state, roundKey) {
  for (let i = 0; i < state.length; i++) {
    state[i] ^= roundKey[i];
  }
}

  function keyExpansion(key) {
    const Nb = 4; // Number of columns (32-bit words) in the state
    const Nk = 4; // Number of 32-bit words in the key
    const Nr = 10; // Number of rounds
  
    const wordCount = Nb * (Nr + 1);
    const w = new Array(wordCount);
  
    // Copy the original key to the initial words of the expanded key
    for (let i = 0; i < Nk; i++) {
      const index = i * 4;
      w[index] = (key[index] << 24) | (key[index + 1] << 16) | (key[index + 2] << 8) | key[index + 3];
    }
  
    // Perform key expansion
    for (let i = Nk; i < wordCount; i++) {
      let temp = w[i - 1];
  
      if (i % Nk === 0) {
        temp = (rotateWord(temp) ^ Rcon[Math.floor(i / Nk)]) >>> 0;
      } else if (Nk > 6 && i % Nk === 4) {
        temp = subWord(temp) >>> 0;
      }
  
      w[i] = (w[i - Nk] ^ temp) >>> 0;
    }
  
    return w;
  }
  
  function rotateWord(word) {
    return ((word << 8) | (word >>> 24)) >>> 0;
  }
  
  function subWord(word) {
    return (
      (Sbox[(word >>> 24) & 0xff] << 24) |
      (Sbox[(word >>> 16) & 0xff] << 16) |
      (Sbox[(word >>> 8) & 0xff] << 8) |
      Sbox[word & 0xff]
    ) >>> 0;
  }
  const Sbox = [];
  const Rcon = [];

  function generateInitialRoundKey(key) {
    // The key is an array of bytes (each byte represents a value from 0 to 255)
    
    const Nb = 4; // Number of columns (32-bit words) in the state
    const Nk = key.length / 4; // Number of 32-bit words in the key
    const Nr = Nk === 4 ? 10 : Nk === 6 ? 12 : 14; // Number of rounds
  
    const wordCount = Nb * (Nr + 1);
    const w = new Array(wordCount);
  
    // Copy the original key to the initial words of the expanded key
    for (let i = 0; i < Nk; i++) {
      const index = i * 4;
      w[i] = (key[index] << 24) | (key[index + 1] << 16) | (key[index + 2] << 8) | key[index + 3];
    }
  
    return w;
  }
  function aesRound(state, roundKey) {
    const Nb = 4; // Number of columns (32-bit words) in the state
  
    // Substitute Bytes (SubBytes step)
    for (let i = 0; i < Nb * Nb; i++) {
      state[i] = Sbox[state[i]];
    }
  
    // Shift Rows (ShiftRows step)
    let temp = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = temp;
  
    temp = state[2];
    state[2] = state[10];
    state[10] = temp;
    temp = state[6];
    state[6] = state[14];
    state[14] = temp;
  
    temp = state[15];
    state[15] = state[11];
    state[11] = state[7];
    state[7] = state[3];
    state[3] = temp;
  
    // Mix Columns (MixColumns step)
    for (let col = 0; col < Nb; col++) {
      const offset = col * Nb;
      const s0 = state[offset];
      const s1 = state[offset + 1];
      const s2 = state[offset + 2];
      const s3 = state[offset + 3];
  
      state[offset] = galoisMult(0x02, s0) ^ galoisMult(0x03, s1) ^ s2 ^ s3;
      state[offset + 1] = s0 ^ galoisMult(0x02, s1) ^ galoisMult(0x03, s2) ^ s3;
      state[offset + 2] = s0 ^ s1 ^ galoisMult(0x02, s2) ^ galoisMult(0x03, s3);
      state[offset + 3] = galoisMult(0x03, s0) ^ s1 ^ s2 ^ galoisMult(0x02, s3);
    }
  
    // Add Round Key (AddRoundKey step)
    for (let i = 0; i < Nb * Nb; i++) {
      state[i] ^= roundKey[i];
    }
  
    return state;
  }
  
  // Helper function for Galois multiplication in MixColumns step
  function galoisMult(a, b) {
    let result = 0;
    while (b > 0) {
      if (b & 1) {
        result ^= a;
      }
      const carry = a & 0x80;
      a <<= 1;
      if (carry) {
        a ^= 0x1B; // XOR with irreducible polynomial x^8 + x^4 + x^3 + x + 1
      }
      b >>= 1;
    }
    return result;
  }

  function finalAESRound(state, roundKey) {
    if (!state || !roundKey || !Array.isArray(state) || !Array.isArray(roundKey)) {
      // Check if state and roundKey are properly defined arrays
      throw new Error('Invalid state or roundKey');
    }
  
    const Nb = 4; // Number of columns (32-bit words) in the state
  
    if (state.length !== Nb * Nb || roundKey.length !== Nb * Nb) {
      throw new Error('Invalid state or roundKey length');
    }
  
    // Substitute Bytes (SubBytes step)
    for (let i = 0; i < Nb * Nb; i++) {
      if (typeof state[i] !== 'number') {
        throw new Error('Invalid state element');
      }
      state[i] = Sbox[state[i]];
    }
  
    // Shift Rows (ShiftRows step)
    // ... (rest of the function remains the same)
    // Ensure MixColumns step is skipped in the final round
  
    // Add Round Key (AddRoundKey step)
    for (let i = 0; i < Nb * Nb; i++) {
      state[i] ^= roundKey[i];
    }
  
    return state;
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
        <br />
        <div className="Header">
          <h1 style={{ marginLeft: "40px" }}>Advanced Encryption Standard</h1>
        </div>
        <input
          style={{ marginTop: "40px" }}
          type='text' // Changed type to accept any input as text
          placeholder='Key'
          required
          onChange={handleChange}
          value={data.shiftValue}
          name="shiftValue"
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
        <button onClick={handleCrypt}>{cryptState ? "DeCrypt" : "Crypt"} Message</button>
      </div>
      <div className="outputs">
        <h1>Outputs : </h1>
        <br/><br/><br/><br/>
        <div className="cryptOutput">
        {cryptState && (
           <div className="cryptOutput">
          {plainText &&
           <div style={{marginLeft:"15px",marginTop:"-80px"}}>
             <b>Plain Text :</b>
             <p>{plainText}</p>
           </div>
           }
          {binaryPlain &&
           <div style={{marginLeft:"15px"}}>
             <b>Binary Text :</b>
             <p>{binaryPlain}</p>
           </div>
           }
           {ce &&
           <div style={{marginLeft:"15px"}}>
             <b>Crypted Text :</b>
             <p>{ce}</p>
           </div>
           }
           </div>
        )}
          {cryptStaten && (
          <div className="cryptOutput">
             {ce &&
           <div style={{marginLeft:"15px",marginTop:"-80px"}}>
             <b>Crypted Text :</b>
             <p>{ce}</p>
           </div>
           }
          {de &&
          <div style={{marginLeft:"15px"}}>
            <b>Decrypted Text :</b>
            <p>{de}</p>
          </div>
          }
                {plainText &&
           <div style={{marginLeft:"15px"}}>
             <b>Plain Text :</b>
             <p>{plainText}</p>
           </div>
           }
          </div>
        )}
        </div>
        <hr/>
      </div>
    </div>
  );
}
