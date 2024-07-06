import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importer Link depuis React Router
import { firestore } from './firebase';  // Import Firestore
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Import Firestore functions for updating document
import { AppBar, Toolbar, Typography, Container, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import './App.css';
import App from './App';
import Footer from './Footer';

const collections = ['radhi', 'form', 'training', 'resultat'];

function App1() {
  const [documents, setDocuments] = useState({
    radhi: [],
    form: [],
    training: [],
    resultat: []
  });
  const [isConnected, setIsConnected] = useState({
    radhi: false,
    form: false,
    training: false,
    resultat: false
  });
  const [documentCounts, setDocumentCounts] = useState({
    radhi: 0,
    form: 0,
    training: 0,
    resultat: 0
  });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const promises = collections.map(async (col) => {
          const querySnapshot = await getDocs(collection(firestore, col));
          if (querySnapshot.empty) {
            setIsConnected(prevState => ({ ...prevState, [col]: true }));
            setDocumentCounts(prevState => ({ ...prevState, [col]: 0 }));
            return [];
          } else {
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIsConnected(prevState => ({ ...prevState, [col]: true }));
            setDocumentCounts(prevState => ({ ...prevState, [col]: docs.length }));
            return docs;
          }
        });

        const results = await Promise.all(promises);
        const updatedDocuments = collections.reduce((acc, col, index) => {
          acc[col] = results[index];
          return acc;
        }, {});

        setDocuments(updatedDocuments);
      } catch (error) {
        console.error('Error connecting to Firestore:', error);
        setIsConnected({
          radhi: false,
          form: false,
          training: false,
          resultat: false
        });
      }
    };

    fetchCollections();
  }, []); // Only runs once on component mount

  const handleUpdateResultat = async (col, docId, newResultat) => {
    try {
      const docRef = doc(firestore, col, docId);
      await updateDoc(docRef, { resultat: newResultat });
      console.log(`Document ${docId} updated successfully.`);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/Stats1">ANALYSE PRINCIPALE</Button>
          <Button color="inherit" component={Link} to="/Stats">ANALYSE DE FORMULAIRE</Button>
          <Button color="inherit" component={Link} to="/Stats2">ANALYSE ENTRAINEMENT</Button>
          <Button color="inherit" component={Link} to="/Stats3">ANALYSE QUOTIDIEN</Button>
          <Button color="inherit" component={Link} to="/">RETOURNER</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          {collections.map((col) => (
            <Box key={col} sx={{ mb: 4 }}>
              <Typography variant="h6">{col}</Typography>
              <Typography variant="h6">Connecté : {isConnected[col] ? "Oui" : "Non"}</Typography>
              <Typography variant="h6">Nombre de documents : {documentCounts[col]}</Typography>
              {documents[col].length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#87CEEB' }}>
                      <TableRow>
                        {Object.keys(documents[col][0]).map((key) => (
                          <TableCell key={key} sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {key}
                          </TableCell>
                        ))}
                        {col === 'resultat' && <TableCell sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>Modifier</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents[col].map((doc) => (
                        <TableRow key={doc.id}>
                          {Object.keys(documents[col][0]).map((key) => (
                            <TableCell key={key}>{JSON.stringify(doc[key])}</TableCell>
                          ))}
                          {col === 'resultat' && (
                            <TableCell>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  const newResultat = prompt('Entrez la nouvelle valeur pour "resultat":', doc.resultat);
                                  if (newResultat !== null) {
                                    handleUpdateResultat(col, doc.id, newResultat);
                                  }
                                }}
                              >
                                Modifier
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">No documents found.</Typography>
              )}
            </Box>
          ))}
        </Paper>

      </Container>

    </Box>

  );
}

export default App1;
