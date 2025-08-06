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
    Chip,
    CircularProgress,
    Box,
    Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Check, Close } from '@mui/icons-material';
import axios from 'axios';

export default function Units() {
    const [units, setUnits] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUnit, setCurrentUnit] = useState({ id: 0, name: '', isActive: true });
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/unit');
            setUnits(response.data);
        } catch (error) {
            showSnackbar('Error fetching units');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (unit = null) => {
        setCurrentUnit(unit ? { ...unit } : { id: 0, name: '', isActive: true });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUnit(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (currentUnit.id) {
                await axios.put(`/api/unit/${currentUnit.id}`, currentUnit);
                showSnackbar('Unit updated successfully');
            } else {
                const response = await axios.post('/api/unit', currentUnit);
                showSnackbar('Unit created successfully');
            }
            fetchUnits();
            handleCloseDialog();
        } catch (error) {
            showSnackbar(error.response?.data || 'Error saving unit');
        }
    };

    const handleArchive = async (id) => {
        try {
            await axios.delete(`/api/unit/${id}`);
            showSnackbar('Unit archived successfully');
            fetchUnits();
            setDeleteConfirm(null);
        } catch (error) {
            showSnackbar(error.response?.data || 'Error archiving unit');
            setDeleteConfirm(null);
        }
    };

    const showSnackbar = (message) => {
        setSnackbar({ open: true, message });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Unit
                </Button>
            </Box>

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
                                <TableCell>Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {units.map(unit => (
                                <TableRow key={unit.id}>
                                    <TableCell>{unit.id}</TableCell>
                                    <TableCell>{unit.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={unit.isActive ? 'Active' : 'Archived'}
                                            color={unit.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleOpenDialog(unit)}>
                                                <Edit color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                        {deleteConfirm === unit.id ? (
                                            <>
                                                <Tooltip title="Confirm Archive">
                                                    <IconButton onClick={() => handleArchive(unit.id)}>
                                                        <Check color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Cancel">
                                                    <IconButton onClick={() => setDeleteConfirm(null)}>
                                                        <Close color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <Tooltip title="Archive">
                                                <IconButton onClick={() => setDeleteConfirm(unit.id)}>
                                                    <Delete color="action" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentUnit.id ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Unit Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentUnit.name}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="isActive"
                        label="Status"
                        select
                        fullWidth
                        variant="standard"
                        value={currentUnit.isActive}
                        onChange={handleInputChange}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value={true}>Active</option>
                        <option value={false}>Archived</option>
                    </TextField>
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