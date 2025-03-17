import { useState, useCallback, useRef, useEffect } from "react"
import {
    CRow,
    CImage,
    CCol,
    CFormCheck,
    CNav,
    CButton, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CTab, CTableHead, CTableBody, CNavItem, CNavLink, CTabContent, CTabPane,

    CToaster,
    CSpinner
} from "@coreui/react"
import { useDropzone } from "react-dropzone";
import { FaFilePdf, FaFileExcel, FaFileVideo, FaTrashAlt } from "react-icons/fa";
import { postImageComplete, postImageStart, uploadChunkWithRetry } from "../../../models/galleryModel";
import { ToastMessage } from "../../../components/ToastMessage";
import { data } from "autoprefixer";
import { usePushToastHelper } from "../../../utils/toastHelper";


const GalleryModal = ({ visible = false, setVisible = () => { }, onSelectImages = () => {}, acceptedFormat = null }) => {

    const [activeTab, setActiveTab] = useState('upload');
    // const [selectedFile, setSelectedFile] = useState();
    const [gallery, setGallery] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState({});

    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false);
    
    const toaster = useRef()
    // const [toasts, setToasts] = useState(0)
    const { toasts, pushToastsMessage } = usePushToastHelper();

    // const addToast = (type, message) => {

    //     const newToast = {
    //         id: Date.now(),
    //         component : <ToastMessage key={Date.now()} type={type} message={message} />,
    //     } 
    //     setToasts((prevToast) => newToast.component );
        

    // }


    useEffect(() => {
        if(activeTab === 'gallery') {
            fetchImages();
        }
    }, [activeTab])


    const fetchImages = async () => {
        if(loading) return;
        setLoading(true);
        try {
            console.log('test log');
            // const response = await fetch(`/api/gallery?page=${page}&limit=20`);
            // const data = await response.json();
            // setGallery((prev) => [...prev, ...data]);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    }

    const onDrop = useCallback((acceptedFiles) => {
        setUploading(true)
        const fileObjects = acceptedFiles.map((file, index) => ({
            id: Date.now() + index, // Unique ID for deletion
            url: URL.createObjectURL(file),
            orgFile : file,
            type: file.type,
            name: file.name,
        }));
        startImageUpload(fileObjects);
        setGallery((prev) => [...prev, ...fileObjects]);
        setActiveTab('gallery')
        setUploading(false)
    }, []);

    const startImageUpload = async (files) => {
        console.log(files, "filessss");
        
            for(let fileObj of files) {
            try {
                const file = fileObj.orgFile;
                const fileName = fileObj.name;
                const mimetype = file.type;     // ### check
                setUploadingFiles((prev) => ({
                    ...prev, 
                    [fileName]: { fileName, isUploading: true }
                }));

                if (!file) {
                    console.error("No valid file found!");
                    // addToast("error", "No valid file selected.");
                    pushToastsMessage("error", "No valid file selected.")
                    return;
                }
                
                
                const totalSize = file?.size;
                const chunkSize = 5 * 1024 * 1024;
                const totalParts = Math.ceil(totalSize / chunkSize);
                
                // Upload whole file
                if (totalSize < chunkSize) {
                    console.log("File is smaller than chunk size, sending as a single request.");
                    
                    const formData = new FormData();
                    formData.append("fileName", fileName);
                    formData.append("file", file);
        
                    const result = await uploadChunkWithRetry(formData);
                    console.log(result, "Response for single-part upload");
                    // setUploading(false);
                    
                    setGallery((prev) =>
                        prev.map((oldFile) =>
                            oldFile.id === fileObj.id
                            ? { 
                                ...oldFile, 
                                url: result?.data?.Location,
                                size: totalSize, 
                                type: mimetype, 
                                name: fileName 
                              }
                            : oldFile
                        )
                      );
                      
                    setUploadingFiles((prev) => {
                        const updated = { ...prev };
                        delete updated[fileName];
                        return updated;
                    });
                    return; 
                }

                // Upload chunk file.
                const response = await postImageStart(fileName, mimetype)
                const uploadId = response.data.uploadId;
                let partNumber = 0;
                let parts = [];

                for (let start = 0; start < totalSize; start += chunkSize) {
                    partNumber += 1;
                    const chunk = file.slice(start, start + chunkSize);
                    console.log(chunk, "updated chunkkkk size")

                    console.log(`Chunk ${partNumber}: Size = ${chunk.size} bytes`);
                    if (chunk.size === 0) {
                        console.error(`Empty chunk detected at part ${partNumber}, skipping.`);
                        continue;
                    }

                    const formData = new FormData();
                    formData.append('fileName', fileName);
                    formData.append('uploadId', uploadId);
                    formData.append('partNumber', partNumber);
                    formData.append('file', chunk);
        
                    console.log(`Uploading part ${partNumber} of ${totalParts}...`);
                    const result = await uploadChunkWithRetry(formData);
                    console.log(result, `Response for part ${partNumber}`);
        
                    if (result?.data) {
                        parts.push({
                            ETag: result.data?.ETag ? result.data.ETag?.replace(/"/g, "") : '',
                            partNumber: Number(result.data.PartNumber),
                        });
                    }
                }
                
                const resultFinish = await postImageComplete(fileName, uploadId, parts)
                console.log(resultFinish, "reponsesss complete")
                // setUploading(false)
                setGallery((prev) =>
                    prev.map((oldFile) =>
                        oldFile.id === fileObj.id
                        ? { 
                            ...oldFile, 
                            url: resultFinish?.data?.Location,
                            size: totalSize, 
                            type: mimetype, 
                            name: fileName 
                          }
                        : oldFile
                    )
                  );

                setUploadingFiles((prev) => {
                    const updated = { ...prev };
                    delete updated[fileName];
                    return updated;
                });
            }
            catch(error) {
                setUploading(false)
                setUploadingFiles((prev) => {
                    const updated = { ...prev };
                    delete updated[fileObj.name];
                    return updated;
                });
                
                setGallery((prev) => prev.filter((item) => item.id !== fileObj.id));

                console.log(error, "error uploading...")
                pushToastsMessage('error', error.message)
            }
        }
    }

    // console.log(uploadingFiles, "file loaddddsss");

    // const chunkImageUpload = async (files) => {

    //     try {
    //         const fileName = files[0].name;
    //         const result = await postImageStart(fileName)
    //         console.log(result, "reponsesss")
    //     }
    //     catch(error) {
    //         console.log(error, "error uploading...")
    //         addToast('error', error.message);
    //     }
    // }

    const startImageUpload = async (files) => {
        console.log(files[0], "filessss");
        let partNumber = 0;
        let parts = [];
        try {
            const file = files[0].orgFile;
            const fileName = files[0].name;
            const response = await postImageStart(fileName)
            console.log(response, file, "reponsesss start")
            // ### divide file into chunk and sent with requires
            const uploadId = response.data.uploadId;
            const totalSize = file?.size     //calculate total size
            const chunkSize = 2 * 1024 * 1024;      // 2MB
            const totalParts = Math.ceil(totalSize / chunkSize);

            for (let start = 0; start < totalSize; start += chunkSize) {
                partNumber += 1;
                const chunk = file.slice(start, start + chunkSize);
    
                const formData = new FormData();
                formData.append('fileName', fileName);
                formData.append('uploadId', uploadId);
                formData.append('partNumber', partNumber);
                formData.append('file', chunk);
    
                console.log(`Uploading part ${partNumber} of ${totalParts}...`);
                const result = await postImageChunk(formData);
                console.log(result, `Response for part ${partNumber}`);
    
                if (result?.data) {
                    parts.push({
                        ETag: result.data.Etag.replace(/"/g, ""), // Remove extra quotes
                        partNumber: Number(result.data.PartNumber),
                    });
                }
            }
            // ### loop to send file 
            // while( chunkSize > 0) {

            // }
                // partNumber = partNumber + 1;
                // // let response = {
                // //     data : { uploadId: 'xyz'}
                // // }
                // const formData = new FormData();
                // formData.set('fileName', fileName)
                // formData.set('uploadId', response.data.uploadId)
                // formData.set('partNumber', partNumber)
                // formData.set('file', files[0].orgFile)
                // // fileName, response.data.uploadId, partNumber, files[0].orgFile
                // const result = await postImageChunk(formData )
                // console.log(result, "reponsesss chunk")
                // if(result) {
                //     parts.push({ 
                //         ETag: result.data?.Etag || null, 
                //         partNumber : Number(result.data?.PartNumber) || 1
                //     })
                // }

            const resultFinish = await postImageComplete(fileName, response.data.uploadId, parts)
            console.log(resultFinish, "reponsesss complete")

        }
        catch(error) {
            console.log(error, "error uploading...")
            addToast('error', error.message);
        }
    }

    const chunkImageUpload = async (files) => {

        try {
            const fileName = files[0].name;
            const result = await postImageStart(fileName)
            console.log(result, "reponsesss")
        }
        catch(error) {
            console.log(error, "error uploading...")
            addToast('error', error.message);
        }
    }

    const handleDelete = (id) => {
        // console.log(gallery, selectedImages)
        setGallery((prev) => prev.filter((file) => file.id !== id));
        setSelectedImages((prev) => prev.filter((file) => file.id !== id));
    };

    const handleSelectImage = (file) => {
        console.log("file", file)

        setSelectedImages((prev) => {
            const isSelected = prev.some((item) => item.id === file.id);
            const newSelection = isSelected ? prev.filter((item) => item.id !== file.id) : [...prev, file];
            onSelectImages(newSelection);
            return newSelection;
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [],
            "video/*": [],
            "application/pdf": [],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
            "application/vnd.ms-excel": [],
        },
        onDrop,
    });

    return (
        <>
            <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
                <CModalHeader>
                    <CModalTitle>File Uploader</CModalTitle>
                </CModalHeader>
                <CModalBody
                    style={{
                        maxHeight: "60vh",
                        overflowY: "auto",
                    }}>

                    <CNav variant="tabs">
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 'upload'}
                                onClick={() => setActiveTab('upload')}>
                                Upload Image
                            </CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink
                                active={activeTab === 'gallery'}
                                onClick={() => setActiveTab('gallery')}>
                                Select Gallery
                            </CNavLink>
                        </CNavItem>

                    </CNav>
                    <CTabContent>
                        {/* Upload section */}
                        <CTabPane visible={activeTab === 'upload'}>
                            <div
                                {...getRootProps()}
                                className="mt-3 p-5 border border-dashed rounded-lg text-center cursor-pointer"
                                style={{
                                    borderColor: isDragActive ? "blue" : "#ccc",
                                    backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
                                }}
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p className="text-primary">Drop the files here...</p>
                                ) : (
                                    <p>Drag & drop an image here, or click to select files</p>
                                )}
                            </div>

                            {/* File select input section */}
                            {/* <CForm name='file_upload' className="mt-3">
                                <CFormLabel htmlFor="fileUpload">Upload an Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="fileUpload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {selectedFile && (
                                    <div className="mt-3">
                                        <p>Preview:</p>
                                        <CImage
                                            src={URL.createObjectURL(selectedFile)}
                                            width={100}
                                            alt="Preview"
                                        />
                                    </div>
                                )}
                            </CForm> */}
                        </CTabPane>

                        {/* Gallery section */}
                        <CTabPane visible={activeTab === 'gallery'}>
                            <CRow className="mt-3">
                                {gallery.length > 0 ? (
                                    gallery.map((file) => (

                                    <CCol key={file.id} md={4} lg={3} sm={6} xs={6} className="mb-3 text-center">
                                        <div className="position-relative p-3 rounded shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ border: "2px solid #ccc", borderRadius: "10px", maxWidth: "180px", minHeight: "200px", backgroundColor: "#f8f9fa" }}>
                                            { uploadingFiles[file.name]?.isUploading ? '' :
                                            <>
                                                <CFormCheck className="position-absolute" style={{ position: "absolute", top: "5px", left: "5px", zIndex: 1 }} checked={
                                                    selectedImages && selectedImages.some((item) => item.id === file.id)
                                                } onChange={() => handleSelectImage(file)} />
                                                <FaTrashAlt className="position-absolute" style={{ top: "5px", right: "5px", cursor: "pointer", color: "red", fontSize: "1.2rem" }} onClick={() => handleDelete(file.id)} />
                                            </>
                                            }
                                            {uploadingFiles[file.name]?.isUploading ? (
                                                <CSpinner color="primary" size="lg" />
                                            ) :
                                            file.type.startsWith("image/") ? (
                                                <CImage 
                                                    src={file.url} 
                                                    width={150} 
                                                    height={150} 
                                                    alt={file.name} 
                                                    className="rounded" 
                                                    style={{ objectFit: "contain", maxHeight: "150px" }} />
                                            ) : file.type.startsWith("video/") ? (
                                                <video 
                                                    width="150" 
                                                    controls>
                                                    <source src={file.url} type={file.type} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : file.type === "application/pdf" ? (
                                                <FaFilePdf size={50} color="red" />
                                            ) : file.type.includes("spreadsheet") || file.type.includes("excel") ? (
                                                <FaFileExcel size={50} color="green" />
                                            ) : (
                                                <p>Unsupported file type</p>
                                            )}
                                            <p className="mt-2 mb-0 text-muted text-center" style={{ fontSize: "0.85rem", fontWeight: "bold", wordBreak: "break-word" }}>{file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name}</p>
                                        </div>
                                    </CCol>

                                    ))
                                ) : (
                                    <p>No files uploaded yet.</p>
                                )}
                            </CRow>
                            <div className="text-center mt-3">
                                <CButton color="primary" onClick={fetchImages} disabled={loading}>
                                    {loading ? "Loading..." : "Load More"}
                                </CButton>
                            </div>
                        </CTabPane>
                    </CTabContent>
                </CModalBody>

                <CModalFooter>
                    <CButton 
                        color="secondary" 
                        onClick={() => {
                            setSelectedImages([])
                            setVisible(false)
                        }}>
                        Close
                    </CButton>
                    <CButton color="primary"
                        onClick={() => {
                            selectedImages.length <= 0 ?
                                alert('Please select atleast one image.')
                            : (
                                // ##convert alert to message popup
                                alert(selectedImages.length + ' files selected .'),
                                setVisible(() => false)
                            )                        
                        }}
                    >Select</CButton>
                </CModalFooter>
            </CModal>
            <CToaster ref={toaster} push={toasts} placement="top-end" />
        </>
    )
}


export default GalleryModal;