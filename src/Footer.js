import React from 'react';
import { AppBar, Toolbar, Typography, Container, IconButton } from '@mui/material';
import { Email, Facebook, Twitter } from '@mui/icons-material'; // Import des icônes MUI
import healthImage from './health.png'; // Import de votre image

const Footer = () => {
    return (
        <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0, height: '200px' }}>
            <Toolbar>
                <Container maxWidth="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={healthImage} alt="Health Image" style={{ width: '70px', marginRight: '10px' }} />
                            <Typography variant="body1" color="inherit">
                                CONTACT US: radhibenafia123@gmail.com
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>

                            <Typography variant="body1" color="inherit" >
                                TELEPHONE: +216 4564464446
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>

                            <Typography variant="body1" color="inherit" >

                                DESCRIPTION :LE TABLEAU DE BORD ADMINISTRATIF PERMET DE GÉRER EFFICACEMENT VOTRE APPLICATION MOBILE. IL OFFRE UNE INTERFACE CENTRALISÉE POUR SURVEILLER ET CONTRÔLER LES DONNÉES ESSENTIELLES.
                            </Typography>
                        </div>

                    </div>
                    <div>
                        <IconButton href="mailto:radhibenafia123@gmail.com" color="inherit">
                            <Email />
                        </IconButton>
                        <IconButton href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" color="inherit">
                            <Facebook />
                        </IconButton>
                        <IconButton href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" color="inherit">
                            <Twitter />
                        </IconButton>
                    </div>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
