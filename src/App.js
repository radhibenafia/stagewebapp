import React, { useState } from 'react';
import { firestore } from './firebase';
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence and motion from framer-motion
import App1 from './app1';
import { AppBar, Toolbar, Typography, Container, Select, MenuItem, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Stats from './Stats';
import Stats1 from './Stats1';
import Footer from './Footer';
import Stats2 from './stats2';
import Stats3 from './stats3';
import './App.css';

function Home() {
  const [documents, setDocuments] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);
  const [selectedCollection, setSelectedCollection] = useState('radhi');

  const collections = ['radhi', 'form', 'training', 'resultat'];

  const connectToFirestore = async () => {
    try {
      console.log(`Connecting to Firestore collection: ${selectedCollection}`);
      const querySnapshot = await getDocs(collection(firestore, selectedCollection));

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        setIsConnected(true);
        setDocumentCount(0);
        setDocuments([]);
      } else {
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docs);
        setDocumentCount(docs.length);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting to Firestore:', error);
      setIsConnected(false);
    }
  };

  return (
    <AnimatePresence exit={{ when: "beforeChildren" }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Déplacement vers le haut au démarrage
        animate={{ opacity: 1, y: 0 }} // Animation d'entrée
        exit={{ opacity: 0 }} // Animation de sortie
        transition={{ duration: 0.5 }}
        key="home"
        sx={{ flexGrow: 1 }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/app1" sx={{ marginLeft: 'auto' }}>ANALYSE DE DONNEES</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {collections.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
              <Button variant="contained" color="primary" sx={{ backgroundColor: '#2775c2' }} onClick={connectToFirestore}>
                Connect to Firestore
              </Button>

            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Connecté : {isConnected ? "Oui" : "Non"}</Typography>
              <Typography variant="h6">Nombre de documents : {documentCount}</Typography>
              {documents.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#87CEEB' }}>
                      <TableRow>
                        {Object.keys(documents[0]).map((key) => (
                          <TableCell key={key} sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {key}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          {Object.keys(documents[0]).map((key) => (
                            <TableCell key={key}>{JSON.stringify(doc[key])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">No documents found.</Typography>
              )}
            </Box>
          </Paper>
        </Container>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app1" element={<App1 />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/stats1" element={<Stats1 />} />
        <Route path="/stats2" element={<Stats2 />} />
        <Route path="/stats3" element={<Stats3 />} />

      </Routes>
    </Router>
  );
}

export default App;
