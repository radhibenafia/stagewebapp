import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Import Firestore
import { collection, getDocs, addDoc } from "firebase/firestore"; // Import Firestore functions
import { Container, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, AppBar, Toolbar, Button } from '@mui/material'; // Import MUI components
import Chart from 'chart.js/auto';
import { TextField } from '@mui/material';

function Stats3() {
    const [documents, setDocuments] = useState([]); // State for 'conseils' collection documents
    const [isConnected, setIsConnected] = useState(false); // State for Firestore connection status
    const [documentCount, setDocumentCount] = useState(0); // State for number of documents
    const [chartInstance, setChartInstance] = useState(null);
    const [message, setMessage] = useState('');
    const [collectionId, setCollectionId] = useState('');

    useEffect(() => {
        const fetchConseilsCollection = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'conseils'));
                if (querySnapshot.empty) {
                    setIsConnected(true); // Connection successful even if no documents found
                    setDocumentCount(0); // No documents found, update count to 0
                    setDocuments([]); // Reset documents to empty array
                } else {
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setIsConnected(true); // Connection successful
                    setDocumentCount(docs.length); // Update document count
                    setDocuments(docs); // Update retrieved documents
                }
            } catch (error) {
                console.error('Error connecting to Firestore:', error);
                setIsConnected(false); // Update connection status in case of error
            }
        };

        fetchConseilsCollection();
    }, []); // Fetch data only once on component mount

    const handleShowId = (id) => {
        alert(`ID de la ligne : ${id}`);
    };

    const handlePlotDiagram = (doc) => {
        // Destroy existing chart if any
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Example data for the chart (adjust as per your needs)
        const labels = Object.keys(doc).filter(key => key !== 'email'); // Filter out 'email' key
        const data = labels.map((key) => {
            if (key === 'co') {
                return doc[key] / 100; // Divide 'co' by 100
            } else if (key === 'pressure') {
                return doc[key] / 1000; // Divide 'pressure' by 1000
            } else {
                return doc[key]; // Keep other fields unchanged
            }
        });

        // Generate random colors for each dataset
        const backgroundColors = Array.from({ length: labels.length }, () => {
            return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
        });
        const borderColors = Array.from({ length: labels.length }, () => {
            return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
        });

        // Plot new chart using Chart.js
        const ctx = document.getElementById('myChart');
        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Diagramme de ${doc.id.split('@')[0].toUpperCase()}`,
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
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

        // Update state with the new chart instance
        setChartInstance(newChartInstance);
    };

    const renderWeatherRecommendations = (doc) => {
        // Example logic based on weather parameters
        const temperature = doc.temperature;
        const cloudCover = doc.cloudCover;
        const co = doc.co;
        const dewPoint = doc.dewPoint;
        const feelsLike = doc.feelsLike;
        const gustSpeed = doc.gustSpeed;
        const humidity = doc.humidity;
        const no2 = doc.no2;
        const pressure = doc.pressure;
        const uvIndex = doc.uvIndex;
        const windSpeed = doc.windSpeed;

        let recommendations = [];

        // Temperature recommendations
        if (temperature < 10) {
            recommendations.push("Froid (Température basse) : Porter des vêtements chauds et isolants. Idéal pour des sports comme le ski, le snowboard, la course à pied.");
        } else if (temperature >= 20) {
            recommendations.push("Chaud (Température élevée) : Opter pour des vêtements légers et respirants. Convient aux sports nautiques, au vélo, à la natation.");
        }

        // Cloud cover recommendations
        if (cloudCover === 'Sunny') {
            recommendations.push("Ensoleillé : Choix de vêtements légers avec protection solaire. Bon pour divers sports extérieurs comme le tennis, le golf, la randonnée.");
        } else if (cloudCover === 'Cloudy') {
            recommendations.push("Nuageux : Prévoir des vêtements légèrement plus chauds. Approprié pour des sports modérés comme le football, le jogging.");
        }

        // CO recommendations
        if (co > 50) {
            recommendations.push("Monitorer la concentration de CO pour éviter les activités intenses si les niveaux sont élevés.");
        } else if (co < 50) {
            recommendations.pudh(" Les conditions actuelles sont propices à des performances physiques optimales sans compromettre la santé respiratoire.");
        }

        // Dew point recommendations
        // Example logic, adjust as per your needs
        if (dewPoint > 15) {
            recommendations.push("Le point de rosée plus élevé peut rendre l'exercice plus difficile. Adapter la tenue en conséquence.");
        }
        if (dewPoint < temperature) {
            recommendations.push("la respiration est bonne")
        }

        // Feels like temperature recommendations
        // Example logic, adjust as per your needs
        if (feelsLike > 25) {
            recommendations.push("Considérer la température ressentie plutôt que la température réelle pour ajuster les vêtements.");
        }

        // Gust speed recommendations
        // Example logic, adjust as per your needs
        if (gustSpeed > 20) {
            recommendations.push("Vérifier les rafales de vent, car elles peuvent affecter la sécurité et le confort lors des sports de plein air.");
        }
        if (gustSpeed > 40) {
            recommendations.push("sport navale non.");
        }

        // Humidity recommendations
        // Example logic, adjust as per your needs
        if (humidity > 40) {
            recommendations.push("Haute humidité peut rendre l'exercice plus épuisant. Choisir des vêtements respirants.");
        }

        // NO2 recommendations
        // Example logic, adjust as per your needs
        if (no2 > 0.1) {
            recommendations.push("Surveiller les niveaux de NO2, éviter les activités intenses si la qualité de l'air est mauvaise.");
        }

        // Pressure recommendations
        // Example logic, adjust as per your needs
        if (pressure < 1030) {
            recommendations.push("Généralement, une pression atmosphérique stable est idéale pour les activités physiques.");
        }

        // UV index recommendations
        // Example logic, adjust as per your needs
        if (uvIndex >= 7) {
            recommendations.push("Porter une protection solaire adéquate pour les activités sous un indice UV élevé.");
        }

        // Wind speed recommendations
        // Example logic, adjust as per your needs
        if (windSpeed > 20) {
            recommendations.push("Adapter l'activité en fonction de la vitesse du vent pour maximiser la sécurité et le plaisir.");
        }

        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Recommandations</Typography>
                <ul>
                    {recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                    ))}
                </ul>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Message"
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <TextField
                        label="ID de la collection"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={collectionId}
                        onChange={(e) => setCollectionId(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleSendMessage}
                    >
                        Envoyer à Firestore
                    </Button>
                </Box>

            </Box>

        );
    };
    const handleSendMessage = async () => {
        try {
            // Validate inputs
            if (!message || !collectionId) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            // Prepare data to send to Firestore
            const recommendationData = {
                message: message,
                collectionId: collectionId,
            };

            // Send data to Firestore
            await addDoc(collection(firestore, 'smsconseils'), recommendationData);

            // Clear input fields after sending
            setMessage('');
            setCollectionId('');

            alert('Message envoyé avec succès à Firestore.');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message à Firestore :', error);
            alert('Erreur lors de l\'envoi du message à Firestore. Veuillez réessayer.');
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit">RETOURNER</Button>
                </Toolbar>
            </AppBar>
            <div style={{ marginTop: '20px', marginBottom: '40px' }}></div>
            <Container>
                <Paper>
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Collection Conseils</Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">CONNECTÉ : {isConnected ? "OUI" : "NON"}</Typography>
                            <Typography variant="subtitle1">NOMBRE DE DOCUMENTS : {documentCount}</Typography>
                        </Box>
                        {documents.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#87CEEB' }}>
                                        <TableRow>
                                            {Object.keys(documents[0]).map((key) => (
                                                key !== 'email' && (
                                                    <TableCell key={key} sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                        {key}
                                                    </TableCell>
                                                )
                                            ))}
                                            <TableCell sx={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documents.map(doc => (
                                            <TableRow key={doc.id}>
                                                {Object.keys(doc).map((key) => (
                                                    key !== 'email' && (
                                                        <TableCell key={key}>{doc[key]}</TableCell>
                                                    )
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
                {chartInstance && renderWeatherRecommendations(documents[0])}
            </Container>
            <div style={{ marginTop: '20px', maxWidth: '1400px', margin: 'auto' }}>
                <canvas id="myChart" width="800" height="600"></canvas>
            </div>
        </Box>
    );
}

export default Stats3;
