import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Importer Firestore
import { collection, getDocs } from "firebase/firestore"; // Importer les fonctions Firestore nécessaires
import { Container, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, AppBar, Toolbar, Button } from '@mui/material'; // Importer les composants MUI nécessaires
import { Link } from 'react-router-dom';
import './App.css';

function Stats2() {
    const [trainingDocuments, setTrainingDocuments] = useState([]); // État pour les documents de la collection training
    const [isTrainingConnected, setIsTrainingConnected] = useState(false); // État pour la connexion à la collection training
    const [trainingDocumentCount, setTrainingDocumentCount] = useState(0); // État pour le nombre de documents dans la collection training

    useEffect(() => {
        const fetchTrainingCollection = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'training'));
                if (querySnapshot.empty) {
                    setIsTrainingConnected(true); // Connexion réussie même si aucun document trouvé
                    setTrainingDocumentCount(0); // Aucun document trouvé, mettre à jour le nombre à 0
                    setTrainingDocuments([]); // Réinitialiser les documents à une liste vide
                } else {
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setIsTrainingConnected(true); // Connexion réussie
                    setTrainingDocumentCount(docs.length); // Mettre à jour le nombre de documents
                    setTrainingDocuments(docs); // Mettre à jour les documents récupérés
                }
            } catch (error) {
                console.error('Error connecting to Firestore:', error);
                setIsTrainingConnected(false); // Mettre à jour l'état de la connexion en cas d'erreur
            }
        };

        fetchTrainingCollection();
    }, []); // Effectue la récupération une seule fois au montage du composant

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit" component={Link} to="/app1">Retourner</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Paper>
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Collection Training</Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">Connecté : {isTrainingConnected ? "OUI" : "NON"}</Typography>
                            <Typography variant="subtitle1">Nombre de documents : {trainingDocumentCount}</Typography>
                        </Box>
                        {trainingDocuments.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#87CEEB' }}>
                                        <TableRow>
                                            {Object.keys(trainingDocuments[0]).map((key) => (
                                                <TableCell key={key} sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                    {key}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {trainingDocuments.map((doc) => (
                                            <TableRow key={doc.id}>
                                                {Object.keys(trainingDocuments[0]).map((key) => (
                                                    <TableCell key={key}>{JSON.stringify(doc[key])}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1">Aucun document trouvé.</Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Stats2;
