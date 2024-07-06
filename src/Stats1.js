import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Importer Firestore
import { collection, getDocs } from "firebase/firestore"; // Importer les fonctions Firestore nécessaires
import { Container, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, AppBar, Toolbar, Button } from '@mui/material'; // Importer les composants MUI nécessaires
import './App.css';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'; // Importer Chart.js
import Footer from './Footer';

function Stats1() {
    const [documents, setDocuments] = useState([]); // État pour les documents de la collection radhi
    const [isConnected, setIsConnected] = useState(false); // État pour la connexion à Firestore
    const [documentCount, setDocumentCount] = useState(0); // État pour le nombre de documents
    const [chartInstance, setChartInstance] = useState(null); // État pour garder une référence au diagramme Chart.js actuel
    const [bmiData, setBmiData] = useState({ bmi: null, color: '' });
    const [age, setAge] = useState(null); // État pour stocker le BMI et la couleur
    const [bmiCurveInstance, setBmiCurveInstance] = useState(null); // État pour garder une référence au graphique de courbe de BMI

    useEffect(() => {
        const fetchRadhiCollection = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'radhi'));
                if (querySnapshot.empty) {
                    setIsConnected(true); // Connexion réussie même si aucun document trouvé
                    setDocumentCount(0); // Aucun document trouvé, mettre à jour le nombre à 0
                    setDocuments([]); // Réinitialiser les documents à une liste vide
                } else {
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setIsConnected(true); // Connexion réussie
                    setDocumentCount(docs.length); // Mettre à jour le nombre de documents
                    setDocuments(docs); // Mettre à jour les documents récupérés
                }
            } catch (error) {
                console.error('Error connecting to Firestore:', error);
                setIsConnected(false); // Mettre à jour l'état de la connexion en cas d'erreur
            }
        };

        fetchRadhiCollection();
    }, []); // Effectue la récupération une seule fois au montage du composant

    const handlePlotDiagram = (doc) => {
        const heightSubtracted = doc.height - 100;
        const bmi = doc.weight / ((doc.height / 100) ** 2);
        let color = ''; // Couleur pour le carré

        // Détruire le diagramme existant s'il y en a un
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Détruire le graphique de courbe de BMI existant s'il y en a un
        if (bmiCurveInstance) {
            bmiCurveInstance.destroy();
        }

        // Mettre à jour l'état avec le nouveau BMI et la couleur
        setBmiData({ bmi: bmi.toFixed(2), color });
        const ageFromFirestore = doc.age; // Adapter selon votre structure Firestore
        setAge(ageFromFirestore);

        // Traçage du nouveau diagramme avec Chart.js
        const ctx = document.getElementById('myChart');
        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Weight', 'Height - 100', 'BMI'],
                datasets: [{
                    label: `Diagramme de ${doc.id.split('@')[0].toUpperCase()}`,
                    data: [doc.weight, heightSubtracted, bmi],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Mettre à jour l'état avec la nouvelle instance du diagramme
        setChartInstance(newChartInstance);

        // Définir les seuils de BMI pour les différentes catégories
        const bmiCategories = [18, 25, 30, 40]; // Insuffisance, Poids Normal, Surpoids, Obésité
        const bmiCategoryColors = [
            'rgba(255, 99, 132, 0.2)',  // Insuffisance
            'rgba(54, 162, 235, 0.2)',  // Poids Normal
            'rgba(255, 206, 86, 0.2)',  // Surpoids
            'rgba(75, 192, 192, 0.2)',  // Obésité
        ];

        // Trouver la bonne couleur en fonction du BMI actuel
        for (let i = 0; i < bmiCategories.length; i++) {
            if (bmi <= bmiCategories[i]) {
                color = bmiCategoryColors[i];
                break;
            }
        }

        // Traçage du graphique de courbe de BMI avec zones colorées
        const bmiCtx = document.getElementById('bmiCurveChart');
        const newBmiCurveInstance = new Chart(bmiCtx, {
            type: 'line',
            data: {
                labels: ['limite Insuffisance de poids ', 'limite Poids Normal', 'limite Surpoids', 'limite Obésité'],
                datasets: [{
                    label: 'Courbe de BMI',
                    data: bmiCategories,
                    backgroundColor: bmiCategoryColors,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                    fill: true,
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Catégories de BMI'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'BMI'
                        }
                    }
                }
            }
        });

        // Mettre à jour l'état avec la nouvelle instance du graphique de courbe de BMI
        setBmiCurveInstance(newBmiCurveInstance);
    };

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
            <div style={{ marginTop: '20px', marginBottom: '40px' }}></div>
            <Container>
                <Paper>
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Collection INFORMATIONS PRINCIPALE</Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">CONNECTE : {isConnected ? "OUI" : "NON"}</Typography>
                            <Typography variant="subtitle1">NOMBRE DE DOCUMENTS : {documentCount}</Typography>
                        </Box>
                        {documents.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#87CEEB' }}>
                                        <TableRow>
                                            {Object.keys(documents[0]).map((key) => (
                                                <TableCell key={key} sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                    {key}
                                                </TableCell>
                                            ))}
                                            <TableCell sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>Action</TableCell> {/* Colonne pour l'action */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documents.map(doc => (
                                            <TableRow key={doc.id}>
                                                {Object.keys(documents[0]).map((key) => (
                                                    <TableCell key={key}>{doc[key]}</TableCell>
                                                ))}
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handlePlotDiagram(doc)}
                                                    >
                                                        Traçage du diagramme
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>Aucun document trouvé.</Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
            {bmiData.bmi && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 5, marginLeft: '100px', width: 150, height: 150 }}>
                    <Box sx={{ width: 20, height: 20, backgroundColor: bmiData.color, marginRight: 1 }} />
                    <Typography variant="body1">RESULTAT ANALYSE BMI: {bmiData.bmi}</Typography>

                    {bmiData.bmi < 18 && (
                        <Typography variant="body2" sx={{ color: 'red', alignItems: 'center', marginTop: 10, marginLeft: '-180px' }}>INSUFFISANCE PONDERALES</Typography>
                    )}
                    {bmiData.bmi >= 18 && bmiData.bmi <= 25 && (
                        <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold', alignItems: 'center', marginTop: 10, marginLeft: '-180px' }}>POIDS NORMALE</Typography>
                    )}
                    {bmiData.bmi > 25 && bmiData.bmi <= 30 && (
                        <Typography variant="body2" sx={{ color: 'orange', fontWeight: 'bold', alignItems: 'center', marginTop: 10, marginLeft: '-180px' }}>SURPOIDS</Typography>
                    )}
                    {bmiData.bmi > 30 && (
                        <Typography variant="body2" sx={{ color: 'red', fontWeight: 'bold', alignItems: 'center', marginTop: 10, marginLeft: '-180px' }}>OBÉSITÉ</Typography>
                    )}
                    {age && (
                        <Typography variant="body1" sx={{ color: 'green', fontWeight: 'bold', alignItems: 'center', marginTop: 18, marginLeft: '-100px' }}>AGE: {age}</Typography>
                    )}
                </Box>
            )}

            <div style={{ marginTop: '20px', maxWidth: '800px', margin: 'auto' }}>
                <canvas id="myChart" width="400" height="300"></canvas> {/* Canvas pour le diagramme */}
            </div>
            <div style={{ marginTop: '20px', maxWidth: '800px', margin: 'auto' }}>
                <canvas id="bmiCurveChart" width="400" height="300"></canvas> {/* Canvas pour la courbe de BMI */}
            </div>

        </Box>
    );
}

export default Stats1;
