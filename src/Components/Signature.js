import { useState } from "react";
import React from 'react';
import Swal from 'sweetalert2'
import CryptoJS, { enc } from "crypto-js";

export default function Signature() {
  const [data, setData] = useState({
    shiftValue: '', // Accept any input for shiftValue as a string
    Message: ""
  });
  const [cryptState, setCryptState] = useState(false);
  const [cryptStaten, setCryptStaten] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");
  

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
        const encryptedText = EncryptSignature(data.Message || fileContent,data.shiftValue);
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
        const decryptedText = DecryptSignature(data.Message || fileContent,data.shiftValue);
        setData(prevData => ({
          ...prevData,
          Message: decryptedText
        }));
        setCryptState(prevState => !prevState);
        setCryptStaten(prevState => !prevState);
      }
    }
  }

  function EncryptSignature(message,key) {
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    console.log(encrypted)
    setEncrypted(prev => encrypted)
    return encrypted;
  }

function DecryptSignature(message,key) {
  const decrypted = CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
  console.log(decrypted)
  setDecrypted(prev => decrypted)
    return decrypted;
}


  return (
    <div className='Main'>
      <div className='Container'>
        <br />
        <div className="Header">
          <h1 style={{ marginLeft: "240px" }}>Signature</h1>
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
             {encrypted &&
           <div style={{marginLeft:"15px",marginTop:"-80px"}}>
             <b>Encrypted Text :</b>
             <p>{encrypted}</p>
           </div>
            }
          </div>
        )}
         {!cryptState && (
           <div className="cryptOutput">
             {decrypted &&
           <div style={{marginLeft:"15px",marginTop:"-80px"}}>
             <b>Decrypted Text :</b>
             <p>{decrypted}</p>
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
