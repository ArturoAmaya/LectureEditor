import React, { useEffect, useMemo, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import AudioStream2 from './AudioStream2';
//import AudioVisualizer from './VoiceVisualizer';

import download from 'downloadjs';
import PDFUpload from "./PDFUpload";

const base_url = "/lecture-editor/lecture-editor/"
const voiceId = '21m00Tcm4TlvDq8ikWAM';
const text = 'Hello, this is a sample text to stream as speech.';
const apiKey = 'sk_b4cb642987a78339396af5fd20c862b9fd97dc7da059c5f5';//'sk_2e13e411b9625de3e3cbb0ee65edfbf40d7c8d822012a971';//'d346e084dc9b17c44398a1667dd38be0';
const voiceSettings = {
  stability: 0.5,
  similarity_boost: 0,
};

const javascriptDefault = `Name: Arturo Amaya
Lecture Name: Lecture 10
HeyGen API key: YTZhODM0NjM2ZGQwNGI4NmExMzg5ZTQwMGFmMjM3ZTAtMTcxNzc5MjAzNA==
Default Composition: [type:pip]
Default Transition: {type: fade, duration: 1.0}
Default Avatar: (id:Luke_public_3_20240306, voice_id:5dddee02307b4f49a17c123c120a60ca, position:0.75;0.75, scale:0.5, style:closeUp, cbc:#453423, bc:#FFEE22)
PDF Name: Lecture 4.pdf
Slides:
    https://drive.google.com/file/d/1lQGVcqZHoQIg2wvSLqeeK_TSbN_2X3Zr/view?usp=share_link
    https://drive.google.com/file/d/1UCtCDOd6QsKpweLOT4vQu8Qlk4QW5uYm/view?usp=share_link   
    https://drive.google.com/file/d/1bfjcDB0c2p_Hp5lB-XpqL8W6LcM5M6xy/view?usp=share_link
--`;
let scenes = []
const Landing = () => {
  // This state restoring was done with https://dev.to/jorensm/how-to-keep-state-between-page-refreshes-in-react-3801
  const _initial_code = useMemo(() => {
    const local_storage_val = localStorage.getItem('state:'+'code');
    if (local_storage_val) {
      return JSON.parse(local_storage_val);
    }
    return Array(1).fill(javascriptDefault);
  }, []);

  const _intial_scene_count = useMemo(() => {
    const local_storage_val = localStorage.getItem('state:'+'scene_count');
    if (local_storage_val) {
      return JSON.parse(local_storage_val);
    } 
    return Array(1).fill(1)
  })

  const _initial_sessionId = useMemo(()=>{
    const local_storage_val = localStorage.getItem('state:'+'sessionId');
    if(local_storage_val){
      document.cookie = `sessionId=${JSON.parse(local_storage_val)}` // missing expiry date n such
      return JSON.parse(local_storage_val);
    } 
    document.cookie = `sessionId=${window.crypto.getRandomValues(new Uint32Array(1))[0]}`
    return document.cookie.split('=')[1]
  })
  const [sceneCount, setSceneCount] = useState(_intial_scene_count)
  const [code, setCode] = useState(_initial_code);//Array(1).fill(javascriptDefault));
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const [sessionId, setSessionID] = useState(_initial_sessionId)
  console.log("sessionID", sessionId)
  const rotateIMG = 90;



  useEffect(() => {
    const state_str = JSON.stringify(code);
    localStorage.setItem('state:' + 'code', state_str)
  }, [code]);

  useEffect(() => {
    const state_str = JSON.stringify(sceneCount);
    localStorage.setItem('state:'+'scene_count', state_str)
  }, [sceneCount]);

  useEffect(()=>{
    const state_str = JSON.stringify(sessionId);

    localStorage.setItem('state:'+'sessionId', state_str)
  })

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        console.log(code)
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };


  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handlenewEditor() {
    const newCode = code.concat(javascriptDefault)
    setCode(newCode)
  }
  function handleCodeChange(index, data) {
    let newCode = code.map((v,i)=>{
      if (i==index){
        return data
      } else {
        return v
      }
    })
    if (index >= newCode.length){
      newCode.push(data)
    }
    setCode(newCode)
  }

  function handleClick(){
    setSceneCount(s=>s.concat(0))
    console.log('aaa')
  }

  const submitScript = async() => {
    const scriptData = {
      header: code[0],
      scenes: code.slice(1),
      audio: true
    }
    const options = {
      method: "POST",
      url: base_url + "submit-script",
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
      },
      data: scriptData,
      responseType: 'blob'
    }
    axios
    .request(options)
    .then(function (response){
      var url = window.URL.createObjectURL(response.data);
      var a = document.createElement('a');
      a.href = url;
      a.download = "video.mp4";
      document.body.appendChild(a); // append the element to the dom
      a.click();
      a.remove();

      window.location.replace(url);
      //console.log("res.data", response.data);
      //console.log(URL.createObjectURL(response.data));  
    })
    //.then(function(blob){
    //  download(blob, "AH.mp4")
    //})
    .catch((err)=>{
      console.log(err)
    })
  }
    
  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>


      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme}/>
        </div>
        <div className="px-4 py-2">
          <PDFUpload sessionId={sessionId}></PDFUpload>
        </div>
        <div className="px-4 py-2">
          <button
            onClick={handleClick}
            className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0")}
          >Add Scene
          </button>
        </div>
        <div className="px-4 py-2">
          <button
            onClick={submitScript}
            className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0")}
          >Generate Video
          </button>
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          
          {
            sceneCount.map((scene, index)=>
            <div>
              <CodeEditorWindow
              key={index*3}
            code={code[index]}
            onChange={(action,data)=>{
              switch (action) {
                case "code": {
                  console.log(index,code,data)
                  handleCodeChange(index,data)
                  //setCode(data);
                  break;
                }
                default: {
                  console.warn("case not handled!", action, data);
                }
              }
            }
            }
            language={language?.value}
            theme={theme.value}
              beforeMount={handlenewEditor}
              />
              <AudioStream2 voiceId={voiceId} text={code[index]} apiKey={apiKey} voiceSettings={voiceSettings} key={index*3+1} count={index}/>
              <button key={index*3+2}
            onClick={console.log("wowza")}
            className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0")}
          >Preview Scene
          </button>
          <div></div>
            </div>
            )
          }

          {

          }
          
        </div>
        <div className="flex flex-col w-full h-full justify-start items-end">
          <img src={require('../media/filmstrip.jpg')} alt="a filmstrip" class="filmstrip"></img>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Landing;
