import React from 'react';
import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../hooks/useLanguage';

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('home')} | {t('studentForm')}</title>
        <meta name="description" content={t('studentForm')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <Container maxWidth="md" className="py-16">
        <Box className="text-center">
          <Typography variant="h3" component="h1" className="mb-4">
            {t('home')}
          </Typography>
          
          <Box className="mt-8 text-left">
            <Typography variant="h5" component="h2" className="mb-4 font-semibold">
              Information Collection for Institutional Email & Future References
            </Typography>
            
            <Typography variant="body1" className="mb-4 leading-relaxed">
              This form collects essential student information to facilitate communication and maintain accurate institutional records. 
              Your institutional email address serves as your primary communication channel for important announcements, academic updates, 
              and administrative matters throughout your enrollment.
            </Typography>
            
            <Typography variant="body1" className="mb-4 leading-relaxed">
              The information provided in this form will be used for:
            </Typography>
            
            <Box className="ml-4 mb-4">
              <Typography variant="body2" className="mb-2">
                • <strong>Institutional Email Setup:</strong> Creating and managing your official institutional email account
              </Typography>
              <Typography variant="body2" className="mb-2">
                • <strong>Academic Records:</strong> Maintaining accurate student records for coursework and degree verification
              </Typography>
              <Typography variant="body2" className="mb-2">
                • <strong>Future References:</strong> Providing verified information for professional references, internship applications, and post-graduation opportunities
              </Typography>
              <Typography variant="body2" className="mb-2">
                • <strong>Official Communication:</strong> Sending time-sensitive information regarding registrations, schedules, and institutional policies
              </Typography>
              <Typography variant="body2">
                • <strong>Emergency Contact:</strong> Reaching you in case of campus emergencies or important administrative matters
              </Typography>
            </Box>
            
            <Typography variant="body1" className="leading-relaxed">
              All information is treated with strict confidentiality and handled in accordance with institutional privacy policies and regulations.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
