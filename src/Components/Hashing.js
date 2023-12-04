import { useState } from "react";
import React from 'react';
import Swal from 'sweetalert2'

export default function Signature() {
  const [data, setData] = useState({
    shiftValue: '', // Accept any input for shiftValue as a string
    Message: ""
  });
  const [cryptState, setCryptState] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [encrypted, setEncrypted] = useState("");
  

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
        const encryptedText = Hashing(data.Message || fileContent);
        setData(prevData => ({
          ...prevData,
          Message: encryptedText
        }));
        setCryptState(prevState => !prevState);
      }
    } else {
      // if (data.Message === "" && fileContent === "") {
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'Empty Message',
      //     icon: 'error',
      //     confirmButtonText: 'Continue'
      //   });
      // } else {
      //   const decryptedText = DecryptSignature(data.Message || fileContent,data.shiftValue);
      //   setData(prevData => ({
      //     ...prevData,
      //     Message: decryptedText
      //   }));
      //   setCryptState(prevState => !prevState);
      //   setCryptStaten(prevState => !prevState);
      // }
    }
  }

  function Hashing(message) {
    sha256(message).then(hash => {
      setEncrypted(hash);
    });
    return encrypted;
  }


  async function sha256(input) {
    // Convert the input string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
  
    // Use the Web Crypto API to generate the SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
    // Convert the hash buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
    return hashHex;
  }
  
  
  return (
    <div className='Main'>
      <div className='Container'>
        <br />
        <div className="Header">
          <h1 style={{ marginLeft: "240px" }}>Hashing</h1>
        </div>
        {/* <input
          style={{ marginTop: "40px" }}
          type='text' // Changed type to accept any input as text
          placeholder='Key'
          required
          onChange={handleChange}
          value={data.shiftValue}
          name="shiftValue"
        /> */}
        <br /><br />
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
        </div>
        <hr/>
      </div>
    </div>
  );
}
