import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useState, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';
// import Loader from '../member/Loader'
import Loader from "../../../utils/Loader";


const ExcelUploadComponent = ({ selectedFiles, ...rest }) => {

    const [loading, setLoading] = useState(false)
    const [excelFile, setExcelFile] = useState(selectedFiles || [])
    console.log("xcel log", selectedFiles);


    const handleExcelFile = async () => {
        if (!selectedFiles || selectedFiles.length === 0) return;
        if (selectedFiles.some((item) => item.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && item.type !== "application/vnd.ms-excel")) {
            console.error("Invalid file type! Please upload an Excel (.xlsx) file.");
            return;
        }
        setLoading(true);

        const fileObj = selectedFiles[0];
        const response = await fetch(fileObj.url)
        const blob = await response.blob()
        // const file = selectedFiles[0]; // Assuming single file upload
        const reader = new FileReader();

        reader.onload = async (e) => {
            const buffer = e.target.result;
            console.log("parsed", buffer);

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.worksheets[0];
            const parsedData = [];
            let indexColumn = [];
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex === 1) {
                    indexColumn = row.values; 
                    console.log("index:::", indexColumn)
                    return;
                }
                
                parsedData.push({
                    id: rowIndex,
                    [indexColumn[1]] : row.getCell(1).value || "",
                    address: row.getCell(2).value || "",
                    mobile: row.getCell(3).value || "",
                    whatsapp : row.getCell(4).value || "",
                    email: row.getCell(5).value || "",
                });
            });
            
            setExcelFile(parsedData);
            setLoading(false);
        };
        
        reader.readAsArrayBuffer(blob);
    };
    
    console.log("index:::", excelFile)

    useEffect(() => {
        handleExcelFile();
    }, [selectedFiles]);

    return (
        <div>
            {loading && <Loader />}
            <CCard className="mb-4">
                <CCardHeader>
                    <h4>Excel Records</h4>
                    {/* <CButton color="primary" className="me-4" >
                        Find Duplicate
                    </CButton>
                    <CButton color="primary" >
                        Remove Duplicate
                    </CButton> */}
                </CCardHeader>
                <CCardBody>
                    <div style={{ maxHeight: 300, overflow: 'auto' }} >
                        {excelFile.length > 0 &&
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Sr</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Address</CTableHeaderCell>
                                        <CTableHeaderCell>Mobile</CTableHeaderCell>
                                        <CTableHeaderCell>Whatsapp</CTableHeaderCell>
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        excelFile.map((item, index) => (
                                            <CTableRow >
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{item.name}</CTableDataCell>
                                                <CTableDataCell>{item.address}</CTableDataCell>
                                                <CTableDataCell>{item.mobile}</CTableDataCell>
                                                <CTableDataCell>{item.whatsapp}</CTableDataCell>
                                                <CTableDataCell>{item.email}</CTableDataCell>
                                                <CTableDataCell><FaTrash onClick={() => setExcelFile((prevData) => prevData.filter((_, i) => i !== index))} /></CTableDataCell>
                                            </CTableRow>
                                        ))
                                    }
                                </CTableBody>
                            </CTable>
                        }
                    </div>
                </CCardBody>
            </CCard>
        </div>
    )
}


export default ExcelUploadComponent;