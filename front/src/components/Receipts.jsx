import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function Receipts() {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        axios.get('/api/receipt')
            .then(response => setReceipts(response.data))
            .catch(error => console.error('Error fetching receipts:', error));
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Resource ID</TableCell>
                        <TableCell>Unit of Measure ID</TableCell>
                        <TableCell>Receipt Document ID</TableCell>
                        <TableCell>Quantity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.map(receipt => (
                        <TableRow key={receipt.id}>
                            <TableCell>{receipt.id}</TableCell>
                            <TableCell>{receipt.resourceId}</TableCell>
                            <TableCell>{receipt.unitOfMeasureId}</TableCell>
                            <TableCell>{receipt.receiptDocumentId}</TableCell>
                            <TableCell>{receipt.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}