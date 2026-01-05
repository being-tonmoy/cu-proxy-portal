import React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const TermsAndConditions = ({
  t, 
  formData, 
  errors, 
  loading,
  onCheckboxChange
}) => {
  return (
    <>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={onCheckboxChange}
              disabled={loading}
              sx={{
                '&.Mui-checked': {
                  color: '#001f3f'
                }
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: '#333' }}>
              {t('termsAndConditions')}
            </Typography>
          }
        />
        {errors.agreeToTerms && (
          <Typography color="error" variant="caption" className="block mt-2">
            {errors.agreeToTerms}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default TermsAndConditions;
