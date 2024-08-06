import React, {useState} from "react";
import axios from "axios"
import {classnames} from "../utils/general";

const PDFUpload = (sessionId) => {
    const [file, setFile] = useState();

    function handleChange(event){
        setFile(event.target.files[0]);
    }

    const handleSubmit = async(event) => {
        event.preventDefault()
        const url = '/lecture-editor/lecture-editor/pdf_upload';
        const formdata = new FormData();
        formdata.append('file', file, {type: 'multipart/form-data'});
        //formdata.append('name', file.name);
        const config = {
            method: "POST",
            url: url,
            headers: {
                'Accept': 'application/json, application/pdf',
                'content-type': 'multipart/form-data',
                Cookie: `sessionId=${sessionId}`
            },
            data: {
                "file": file,
                query: ""
            },
        };
        console.log(formdata.get('file'))
        /*axios.post(url, formdata, config).then((response)=>{
            console.log(response.data);
        }).catch((error)=>{
            console.log(error)
        });*/
        axios.request(config)
        .then((response)=>{
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Upload PDF</h1>
            <input type="file" onChange={handleChange}/>
            <button type="submit" className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0")}>Upload</button>
        </form>
    )
}
export default PDFUpload