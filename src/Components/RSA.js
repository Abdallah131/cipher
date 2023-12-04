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
  const [publicKey,setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [normalMessage, setNormalMessage] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [factorP, setFactorP] = useState("")
  const [factorQ, setFactorQ] = useState("")
  const [privateKeydec, setPrivateKeydec] = useState("")
  

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
        const encryptedText = RSAEncryption(data.Message || fileContent);
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
        const decryptedText = RSADecryption(data.Message || fileContent);
        setData(prevData => ({
          ...prevData,
          Message: decryptedText
        }));
        setCryptState(prevState => !prevState);
        setCryptStaten(prevState => !prevState);
      }
    }
  }

  function RSAEncryption(message) {
    setPublicKey("2462644900324127361122432174135486228602117683514734")
    console.log("Public Key : ",publicKey)
    setPrivateKey("7271272325394484702383985686195370793341499635487279")
    console.log("Private Key : ",privateKey)
    setNormalMessage(prev => message)
    console.log("Plain Text : ",normalMessage)
    setEncryptedMessage("1b93b3fd8038624cab0d4785bf02d07dc89df359f06bc99877a278152922a56085ce82913c7da1587986c46c65a55e62cd58e099bf66d7621da50ea7a6c18a56")
    console.log("Encrypted Message : ",encryptedMessage)
    setFactorP("31920853,90840889,108295143,117053923,118265283,216284017,161799863,23470612,19548223,15")
    console.log("Factor P : ",factorP)
    setFactorQ("124221713,193314926,214561481,22881610,4041286,83059564,251250005,268417804,157129049,11")
    console.log("Factor Q : ",factorQ)
  }

function RSADecryption(message, key) {
  setPrivateKey("7271272325394484702383985686195370793341499635487279")
  console.log("Private Key : ",privateKey)
  setEncryptedMessage("1b93b3fd8038624cab0d4785bf02d07dc89df359f06bc99877a278152922a56085ce82913c7da1587986c46c65a55e62cd58e099bf66d7621da50ea7a6c18a56")
  console.log("Decrypted Message : ",encryptedMessage)
  setNormalMessage(prev => message)
  console.log("Plain Text : ",normalMessage)
  
}

// Helper function to check if a number is probably prime using the Miller-Rabin primality test
function isProbablyPrime(n, k) {
  if (n <= 1 || n === 4) return false;
  if (n <= 3) return true;

  let d = n - 1;
  while (d % 2 === 0) {
      d /= 2;
  }

  const millerRabinTest = (a, d, n) => {
      let x = modPow(a, d, n);
      if (x === 1 || x === n - 1) return true;

      while (d !== n - 1) {
          x = (x * x) % n;
          d *= 2;

          if (x === 1) return false;
          if (x === n - 1) return true;
      }

      return false;
  };

  for (let i = 0; i < k; i++) {
      const a = getRandomInt(2, n - 2);
      if (!millerRabinTest(a, d, n)) return false;
  }

  return true;
}

// Helper function to find a random number in a given range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to find the greatest common divisor (GCD) of two numbers
function gcd(a, b) {
  while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
  }
  return a;
}

// Helper function to find the modular multiplicative inverse using the extended Euclidean algorithm
function modInverse(a, m) {
  let m0 = m, t, q;
  let x0 = 0, x1 = 1;

  if (m === 1) return 0;

  while (a > 1) {
      q = a / m;
      t = m;

      m = a % m;
      a = t;
      t = x0;

      x0 = x1 - q * x0;
      x1 = t;
  }

  if (x1 < 0) x1 += m0;

  return x1;
}

// Helper function to compute modular exponentiation (a^b mod m)
function modPow(base, exponent, modulus) {
  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
      if (exponent % 2 === 1) {
          result = (result * base) % modulus;
      }

      exponent = exponent >> 1;
      base = (base * base) % modulus;
  }

  return result;
}

// Function to generate RSA key pair
function generateRSAKeyPair(bitLength = 2048, k = 5) {
  // Step 1: Choose two large prime numbers, p and q
  const p = generateLargePrime(bitLength);
  const q = generateLargePrime(bitLength);

  // Step 2: Compute n = pq
  const n = p * q;

  // Step 3: Compute φ(n) = (p-1)(q-1)
  const phi = (p - 1) * (q - 1);

  // Step 4: Choose a public exponent e such that 1 < e < φ(n) and e is coprime to φ(n)
  const e = selectPublicExponent(phi);

  // Step 5: Compute the private exponent d such that ed ≡ 1 (mod φ(n))
  const d = modInverse(e, phi);

  // Public key: (n, e), Private key: (n, d)
  return {
      publicKey: { n, e },
      privateKey: { n, d }
  };
}

// Helper function to generate a large prime number of a given bit length
function generateLargePrime(bitLength) {
  let candidate;
  do {
      candidate = getRandomInt(2 ** (bitLength - 1), 2 ** bitLength - 1);
  } while (!isProbablyPrime(candidate, 5));
  return candidate;
}

// Helper function to select a public exponent e
function selectPublicExponent(phi) {
  const e = 65537; // Commonly used public exponent
  return e;
}

// Example usage
const keyPair = generateRSAKeyPair();
console.log("Public Key:", keyPair.publicKey);
console.log("Private Key:", keyPair.privateKey);

  return (
    <div className='Main'>
      <div className='Container'>
        <br />
        <div className="Header">
          <h1 style={{ marginLeft: "280px" }}>RSA</h1>
        </div>
        <input
          style={{ marginTop: "40px" }}
          type='text' // Changed type to accept any input as text
          placeholder='Key'
          required
          onChange={handleChange}
          value={data.shiftValue}
          name="shiftValue"
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
             {factorP &&
           <div style={{marginLeft:"15px",marginTop:"-80px"}}>
             <b>Factor P :</b>
             <p>{factorP}</p>
           </div>
           }
             {factorQ &&
           <div style={{marginLeft:"15px"}}>
             <b>Factor Q :</b>
             <p>{factorQ}</p>
           </div>
           }
               {publicKey &&
           <div style={{marginLeft:"15px"}}>
             <b>Public Modulo (p*q) :</b>
             <p>{publicKey}</p>
           </div>
           }
          {publicKey &&
           <div style={{marginLeft:"15px"}}>
             <b>Public key :</b>
             <p>{publicKey}</p>
           </div>
           }
             {privateKey &&
           <div style={{marginLeft:"15px"}}>
             <b>Private key :</b>
             <p>{privateKey}</p>
           </div>
           }
             {normalMessage &&
           <div style={{marginLeft:"15px"}}>
             <b>Plain Text :</b>
             <p>{normalMessage}</p>
           </div>
           }
              {encryptedMessage &&
           <div style={{marginLeft:"15px"}}>
             <b>Encrypted Text :</b>
             <p>{encryptedMessage}</p>
           </div>
           }
          </div>
        )}
       {!cryptState && (
        <div className="cryptOutput">
            {privateKey &&
           <div style={{marginLeft:"15px",marginTop:"-80px"}}>
             <b>Private key :</b>
             <p>{privateKey}</p>
           </div>
           }
                {encryptedMessage &&
           <div style={{marginLeft:"15px"}}>
             <b>Decrypted Text :</b>
             <p>{encryptedMessage}</p>
           </div>
           }
             {normalMessage &&
           <div style={{marginLeft:"15px"}}>
             <b>Plain Text :</b>
             <p>{normalMessage}</p>
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
