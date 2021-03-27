import React, { useState, useEffect } from "react";
import "./App.css";
import { Parser } from "./legaldocumentparser";

const App = () => {
    const [file, setFile] = useState({});
    const [link, setLink] = useState(null);
    const [name, setName] = useState(null);
    const [error, setError] = useState([]);
    const [json, setJson] = useState(null);
    const [realJSON, setReaLJSON] = useState({});
    const [showJSONError, setShowJSONError] = useState(null);

    const onFileChange = (e) => {
        setFile({ selectedFile: e.target.files[0] });
        setError([]);
    };

    useEffect(() => {
        if (
            file.selectedFile &&
            file.selectedFile.type !==
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
            "application/msword"
        ) {
            alert("only support docx file");
            setFile({});
        } else {
            file.selectedFile && setName(file.selectedFile.name);
        }
    }, [file]);

    const onFileUpload = async () => {
        if (!file.selectedFile) {
            alert("Choose The file First");
            return;
        }
        if (json == null) {
            alert("Please paste JSON data");
            return;
        }
        if (showJSONError === null || showJSONError !== "success") {
            alert("Please check JSON data");
            return;
        }
        const fr = new FileReader();

        fr.readAsArrayBuffer(file.selectedFile);

        fr.onload = () => {
            let arrayBuffer = fr.result;

            Parser(new Uint8Array(arrayBuffer), realJSON, "data")
                .then((a) => {
                    let blob1 = new Blob([a], {
                        type:
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });

                    setLink(URL.createObjectURL(blob1));
                    setError([]);
                })
                .catch((e) => {
                    let errors = [];
                    //  console.log("dadadda ------>", e);
                    e.properties.errors.map((e) => {
                        errors.push({
                            id: e.properties.id,
                            cause: e.properties.explanation,
                        });
                    });
                    setError([...errors]);
                    // setError(JSON.stringify(e.properties.errors));
                });
        };
    };

    const handleLinkClick = () => {
        setTimeout(() => {
            setFile({});
            setJson(null);
            setShowJSONError(null);
            setLink(null);
        }, 1000);
    };

    const handleJSONData = (e) => {
        setShowJSONError(null);
        setJson(e.target.value);
    };

    const checkJSONData = () => {
        if (json == null) return;
        try {
            setReaLJSON({ ...JSON.parse(json) });
            setShowJSONError("success");
        } catch (e) {
            setShowJSONError("There is error in JSON data");
        }
    };

    return (
        <div className="app">
            <div className="button-container">
                <input id="upload" type="file" onChange={onFileChange} />
                <label htmlFor="upload">Browse files...</label>
                <div className="file-name">
                    {file.selectedFile ? file.selectedFile.name : "Upload File"}
                </div>
                <button onClick={onFileUpload}>submit</button>
            </div>
            <div className="flex-center">
                <button onClick={checkJSONData} className="check-json">
                    Check JSON
                </button>
                <div
                    className={
                        showJSONError === "success" ? "success" : "errorJSON"
                    }
                >
                    {showJSONError}
                </div>
            </div>

            <div className="json-container">
                <textarea
                    value={json == null ? "" : json}
                    onChange={handleJSONData}
                    className="json"
                    placeholder="Paste JSON here"
                    cols="50"
                    rows="30"
                ></textarea>
            </div>

            <div className="download">
                <a
                    onClick={handleLinkClick}
                    type="download"
                    download={name ? "Parsed_" + name : "null"}
                    href={link}
                >
                    {link
                        ? "click here to download file"
                        : "download is not ready"}
                </a>
            </div>
            <div className="error">
                {error.map((e, i) => {
                    return (
                        <div key={i} className="flex">
                            <div style={{ color: "white" }} className="m">
                                {i + 1 + ")"}
                            </div>
                            <div className="m">
                                <span style={{ color: "white" }}>
                                    Error id -->
                                </span>
                                {e.id + " "}
                            </div>
                            <div className="m">
                                <span style={{ color: "white" }}>
                                    Error Name -->
                                </span>
                                {e.cause}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default App;
