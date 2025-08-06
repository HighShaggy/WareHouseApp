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
    Tabs,
    Tab,
    Box,
    CircularProgress,
    Tooltip
} from '@mui/material';
import { Delete, Edit, Add, Archive, Unarchive } from '@mui/icons-material';
import axios from 'axios';

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [archivedResources, setArchivedResources] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentResource, setCurrentResource] = useState({ id: 0, name: '', isActive: true });
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const [activeRes, archivedRes] = await Promise.all([
                axios.get('/api/resource'),
                axios.get('/api/resource/archived')
            ]);
            setResources(activeRes.data);
            setArchivedResources(archivedRes.data);
        } catch (error) {
            showSnackbar('Error fetching resources');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (resource = null) => {
        setCurrentResource(resource ? { ...resource } : { id: 0, name: '', isActive: true });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentResource(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (currentResource.id) {
                await axios.put(`/api/resource/${currentResource.id}`, currentResource);
                showSnackbar('Resource updated successfully');
            } else {
                await axios.post('/api/resource', currentResource);
                showSnackbar('Resource created successfully');
            }
            fetchResources();
            handleCloseDialog();
        } catch (error) {
            showSnackbar(error.response?.data || 'Error saving resource');
        }
    };

    const handleArchive = async (id) => {
        try {
            await axios.put(`/api/resource/${id}/archive`);
            showSnackbar('Resource archived successfully');
            fetchResources();
        } catch (error) {
            showSnackbar(error.response?.data || 'Error archiving resource');
        }
    };

    const handleRestore = async (id) => {
        try {
            await axios.put(`/api/resource/${id}/restore`);
            showSnackbar('Resource restored successfully');
            fetchResources();
        } catch (error) {
            showSnackbar(error.response?.data || 'Error restoring resource');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/resource/${id}`);
            showSnackbar('Resource deleted successfully');
            fetchResources();
        } catch (error) {
            showSnackbar(error.response?.data || 'Error deleting resource');
        }
    };

    const showSnackbar = (message) => {
        setSnackbar({ open: true, message });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Active Resources" />
                    <Tab label="Archived Resources" />
                </Tabs>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Resource
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
                            {(activeTab === 0 ? resources : archivedResources).map(resource => (
                                <TableRow key={resource.id}>
                                    <TableCell>{resource.id}</TableCell>
                                    <TableCell>{resource.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={resource.isActive ? 'Active' : 'Archived'}
                                            color={resource.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {activeTab === 0 ? (
                                            <>
                                                <Tooltip title="Edit">
                                                    <IconButton onClick={() => handleOpenDialog(resource)}>
                                                        <Edit color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Archive">
                                                    <IconButton onClick={() => handleArchive(resource.id)}>
                                                        <Archive color="action" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Restore">
                                                    <IconButton onClick={() => handleRestore(resource.id)}>
                                                        <Unarchive color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => handleDelete(resource.id)}>
                                                        <Delete color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentResource.id ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Resource Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentResource.name}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    {currentResource.id && (
                        <TextField
                            margin="dense"
                            name="isActive"
                            label="Status"
                            select
                            fullWidth
                            variant="standard"
                            value={currentResource.isActive}
                            onChange={handleInputChange}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value={true}>Active</option>
                            <option value={false}>Archived</option>
                        </TextField>
                    )}
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