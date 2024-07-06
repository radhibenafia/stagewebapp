import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Importer Firestore
import { collection, getDocs } from "firebase/firestore"; // Importer les fonctions Firestore nécessaires
import { Container, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, AppBar, Toolbar, Button } from '@mui/material'; // Importer les composants MUI nécessaires
import './App.css';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Footer from './Footer';// Importer Chart.js

function Stats() {
  const [documents, setDocuments] = useState([]); // État pour les documents de la collection form
  const [isConnected, setIsConnected] = useState(false); // État pour la connexion à Firestore
  const [documentCount, setDocumentCount] = useState(0); // État pour le nombre de documents
  const [chartInstance, setChartInstance] = useState(null);
  const [glicemyChartInstance, setGlicemyChartInstance] = useState(null);// État pour garder une référence au diagramme Chart.js actuel

  useEffect(() => {
    const fetchFormCollection = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'form'));
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

    fetchFormCollection();
  }, []); // Effectue la récupération une seule fois au montage du composant

  const handleShowId = (id) => {
    alert(`ID de la ligne : ${id}`);
  };
  const getGlicemyCategory = (value) => {
    if (value < 1.1) {
      return 'Glycémie normale';
    } else if (value < 1.25) {
      return 'Prédiabète';
    } else {
      return 'Diabète';
    }
  };
  const handlePlotDiagram = (doc) => {
    // Exemple de logique pour calculer les points en fonction des conditions
    let medicationsPoints = doc.medications === 'yes' ? 100 : 50;
    let surgeriesPoints = doc.pastSurgeries === 'yes' ? 100 : 50;
    let testResultsPoints = doc.recentTestResults === 'yes' ? 100 : 50;
    let tobaccoPoints = doc.tobacco === 'yes' ? 100 : 10;
    let mentalhealthPoints = doc.mentalhealth === 'stress' ? 100 : 50;
    let sicknessPoints = doc.sickness === 'yes' ? 100 : 10;
    let sleepQualityPoints = doc.sleepQuality === 'good' ? 10 : 50;

    // Calculer les points pour familyHistory
    let familyHistoryPoints = doc.familyHistory === 'no' ? 10 : 70;
    let vaccinationPoints = 0;
    if (doc.vaccination === 'yes') {
      vaccinationPoints = 60;
    } else if (doc.vaccination === 'phayser') {
      vaccinationPoints = 80;
    } else {
      vaccinationPoints = 10;
    }

    // Détruire le diagramme existant s'il y en a un
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Traçage du nouveau diagramme avec Chart.js
    const ctx = document.getElementById('myChart');
    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Médicaments',
          'Chirurgies passées',
          'Résultats de tests récents',
          'Tabac',
          'Santé mentale',
          'Maladie',
          'Qualité du sommeil',
          'Antécédents familiaux',
          'vaccinations'// Ajout du libellé pour les antécédents familiaux
        ],
        datasets: [{
          label: `Diagramme de ${doc.id.split('@')[0].toUpperCase()}`,
          data: [
            medicationsPoints,
            surgeriesPoints,
            testResultsPoints,
            tobaccoPoints,
            mentalhealthPoints,
            sicknessPoints,
            sleepQualityPoints,
            familyHistoryPoints,
            vaccinationPoints // Ajout des points pour les antécédents familiaux
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(50, 205, 50, 0.2)',
            'rgba(220, 20, 60, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(50, 205, 50, 1)',
            'rgba(220, 20, 60, 1)',
            'rgba(153, 102, 255, 1)',

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
    if (glicemyChartInstance) {
      glicemyChartInstance.destroy();
    }

    const glicemyData = [0.70, 1.10, 1.25]; // Valeurs de glycémie pour les catégories normale, prédiabète et diabète
    const glicemyLabels = ['Glycémie normale', 'Prédiabète', 'Diabète']; // Libellés pour les catégories de glycémie
    const glicemyColors = ['green', 'orange', 'red']; // Couleurs correspondantes pour chaque catégorie

    // Traçage du cercle de glycémie avec Chart.js
    const glicemyCtx = document.getElementById('glicemyChart');
    const newGlicemyChartInstance = new Chart(glicemyCtx, {
      type: 'doughnut',
      data: {
        labels: glicemyLabels,
        datasets: [{
          label: 'Niveaux de glycémie',
          data: glicemyData,
          backgroundColor: glicemyColors,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} g/L`; // Format de l'étiquette du tooltip
              }
            }
          }
        }
      }
    });

    // Mettre à jour l'état avec la nouvelle instance du diagramme de glycémie
    setGlicemyChartInstance(newGlicemyChartInstance);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/app1">RETOURNER</Button> {/* Bouton pour revenir à Stats */}
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '20px', marginBottom: '40px' }}></div>
      <Container>
        <Paper>
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Collection Form</Typography>
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
      <div style={{ marginTop: '20px', maxWidth: '800px', margin: 'auto' }}>
        <canvas id="myChart" width="400" height="300"></canvas> {/* Canvas pour le diagramme */}
      </div>
      <div style={{ marginTop: '20px', maxWidth: '400px', margin: 'auto' }}>
        <canvas id="glicemyChart" width="400" height="300"></canvas> {/* Canvas pour le diagramme */}
      </div>

    </Box>


  );
}

export default Stats;
