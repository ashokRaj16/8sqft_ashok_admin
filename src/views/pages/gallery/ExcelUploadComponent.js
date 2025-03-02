import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useState, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";

import { FaGripVertical, FaTrash } from "react-icons/fa";
import ExcelJS from 'exceljs';

import Loader from '../member/Loader'

const itemList = [
    { id: 1, name: 'Ashok Raj', address: 'Nashik', role: 'Admin', sequence_no: 1 },
    { id: 2, name: 'Mr. Y', address: 'Nashik', role: 'Admin', sequence_no: 2 },
    { id: 3, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 3 },
    { id: 4, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 4 },
    { id: 5, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 5 },
    { id: 6, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 6 },
    { id: 7, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 7 },

    { id: 8, name: 'Ashok Raj 0', address: 'Nashik', role: 'Admin', sequence_no: 3 },
    { id: 9, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin', sequence_no: 9 },
    { id: 10, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 10 },
    { id: 11, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 11 },
    { id: 12, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 12 },
    { id: 13, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 13 },
    { id: 14, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 14 },

    { id: 15, name: 'Ashok Raj 1', address: 'Nashik', role: 'Admin', sequence_no: 4 },
    { id: 16, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin', sequence_no: 16 },
    { id: 17, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 17 },
    { id: 18, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 18 },
    { id: 19, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 19 },
    { id: 20, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 20 },
    { id: 21, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 21 },

    { id: 22, name: 'Ashok Raj 2', address: 'Nashik', role: 'Admin', sequence_no: 5 },
    { id: 23, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin', sequence_no: 23 },
    { id: 24, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 24 },
    { id: 25, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 24 },
    { id: 26, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 25 },
    { id: 27, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 26 },
    { id: 28, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 27 },

]

const ExcelUploadComponent = ({ selectedFiles, ...rest }) => {

    const [loading, setLoading] = useState(false)
    const [excelFile, setExcelFile] = useState(selectedFiles || [])
    console.log("xcel log", selectedFiles);


    const handleExcelFile = async () => {
        if (!selectedFiles || selectedFiles.length === 0) return;
        if (selectedFiles.some((item) => {
            return (item.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && item.type !== "application/vnd.ms-excel")
        })) {

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

            const worksheet = workbook.worksheets[0]; // Read the first sheet
            const parsedData = [];

            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex === 1) return; // Skip header row

                parsedData.push({
                    id: rowIndex,
                    name: row.getCell(1).value || "",
                    address: row.getCell(2).value || "",
                    role: row.getCell(3).value || "",
                    sequence_no: row.getCell(4).value || rowIndex, // Default sequence number
                });
            });
            setExcelFile(parsedData);
            setLoading(false);
        };

        reader.readAsArrayBuffer(blob);
    };

    // Load Excel file on mount or file change
    useEffect(() => {
        handleExcelFile();
    }, [selectedFiles]);

    return (
        <div>
            {loading && <Loader />}
            <CCard className="mb-4">
                <CCardHeader>
                    <h1>Excel Records</h1>
                    <CButton color="primary" className="me-4" >
                        Find Duplicate
                    </CButton>
                    <CButton color="primary" >
                        Remove Duplicate
                    </CButton>
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
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                        <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        excelFile.map((item, index) => (
                                            <CTableRow >
                                                <CTableDataCell>{index}</CTableDataCell>
                                                <CTableDataCell>{item.name}</CTableDataCell>
                                                <CTableDataCell>{item.address}</CTableDataCell>
                                                <CTableDataCell>{item.role}</CTableDataCell>
                                                <CTableDataCell>{item.sequence_no}</CTableDataCell>
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