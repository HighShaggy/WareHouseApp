import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Container, Paper, Typography } from '@mui/material';
import Documents from './components/Documents';
import Units from './components/Units';
import Resources from './components/Resources';
import Receipts from './components/Receipts';

function App() {
    return (
        <Router>
            <Container maxWidth="md" style={{ marginTop: '20px' }}>
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                    <Typography variant="h4" gutterBottom>
                        Warehouse System
                    </Typography>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <Button variant="contained" component={Link} to="/documents">Documents</Button>
                        <Button variant="contained" component={Link} to="/units">Units</Button>
                        <Button variant="contained" component={Link} to="/resources">Resources</Button>
                        <Button variant="contained" component={Link} to="/receipts">Receipts</Button>
                    </div>
                </Paper>

                <Routes>
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/units" element={<Units />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/receipts" element={<Receipts />} />
                    <Route path="/" element={<Documents />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;