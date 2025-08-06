import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    IconButton,
    Tooltip,
    CircularProgress,
    Box,
    Chip
} from '@mui/material';
import { Delete, Edit, Add, Warning } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentDocument, setCurrentDocument] = useState({
        id: 0,
        number: '',
        date: dayjs().format('YYYY-MM-DD')
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/document');
            setDocuments(response.data);
        } catch (error) {
            showSnackbar('Error fetching documents');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (doc = null) => {
        setCurrentDocument(doc ? {
            ...doc,
            date: dayjs(doc.date).format('YYYY-MM-DD')
        } : {
            id: 0,
            number: '',
            date: dayjs().format('YYYY-MM-DD')
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentDocument(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (currentDocument.id) {
                await axios.put(`/api/document/${currentDocument.id}`, currentDocument);
                showSnackbar('Document updated successfully');
            } else {
                await axios.post('/api/document', currentDocument);
                showSnackbar('Document created successfully');
            }
            fetchDocuments();
            handleCloseDialog();
        } catch (error) {
            showSnackbar(error.response?.data || 'Error saving document');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/document/${id}`);
            showSnackbar('Document deleted successfully');
            fetchDocuments();
            setDeleteConfirm(null);
        } catch (error) {
            showSnackbar(error.response?.data || 'Error deleting document');
            setDeleteConfirm(null);
        }
    };

    const showSnackbar = (message) => {
        setSnackbar({ open: true, message });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const checkDocumentUsage = async (id) => {
        try {
            const response = await axios.get(`/api/receipt?documentId=${id}`);
            return response.data.length > 0;
        } catch (error) {
            console.error('Error checking document usage:', error);
            return false;
        }
    };

    const handleDeleteClick = async (id) => {
        const isUsed = await checkDocumentUsage(id);
        if (isUsed) {
            showSnackbar('Cannot delete document: it is used in receipts');
        } else {
            setDeleteConfirm(id);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Add Document
            </Button>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Number</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map(doc => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.id}</TableCell>
                                    <TableCell>{doc.number}</TableCell>
                                    <TableCell>{dayjs(doc.date).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleOpenDialog(doc)}>
                                                <Edit color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteClick(doc.id)}>
                                                <Delete color={deleteConfirm === doc.id ? 'error' : 'action'} />
                                            </IconButton>
                                        </Tooltip>
                                        {deleteConfirm === doc.id && (
                                            <Chip
                                                icon={<Warning />}
                                                label="Confirm Delete"
                                                color="error"
                                                onClick={() => handleDelete(doc.id)}
                                                onDelete={() => setDeleteConfirm(null)}
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentDocument.id ? 'Edit Document' : 'Add Document'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="number"
                        label="Document Number"
                        fullWidth
                        value={currentDocument.number}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="date"
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentDocument.date}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </>
    );
}