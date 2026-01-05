import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
const PersonalInformation = ({
  t, 
  language,
  formData, 
  errors, 
  loading, 

  onInputChange
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        sx={{
          color: '#001f3f',
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '16px', sm: '18px' }
        }}
      >
        {language === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2, md: 3 } }}>
        {/* First Name and Last Name Row */}
        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2, md: 3 }, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* First Name */}
          <TextField
            fullWidth
            label={t('firstName')}
            name="firstName"
            type="text"
            value={formData.firstName || ''}
            onChange={onInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={loading}
            required
            variant="outlined"
            inputProps={{ maxLength: 50 }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#001f3f'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#003d7a'
                }
              }
            }}
          />

          {/* Last Name */}
          <TextField
            fullWidth
            label={t('lastName')}
            name="lastName"
            type="text"
            value={formData.lastName || ''}
            onChange={onInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={loading}
            required
            variant="outlined"
            inputProps={{ maxLength: 50 }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#001f3f'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#003d7a'
                }
              }
            }}
          />
        </Box>

        {/* Student ID and Phone Number Row */}
        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2, md: 3 }, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Student ID */}
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label={t('studentId')}
              name="studentId"
              value={formData.studentId}
              onChange={onInputChange}
              error={!!errors.studentId}
              helperText={errors.studentId}
              disabled={loading}
              required
              inputProps={{ inputMode: 'numeric' }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#001f3f'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003d7a'
                  }
                }
              }}
            />
          </Box>

          {/* Phone Number */}
          <TextField
            fullWidth
            label={t('phoneNumber')}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            disabled={loading}
            required
            placeholder="01XXXXXXXXX"
            inputProps={{ inputMode: 'numeric' }}
            variant="outlined"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#001f3f'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#003d7a'
                }
              }
            }}
          />
        </Box>

        
            <Box sx={{
              background: 'rgba(76, 175, 80, 0.05)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              width: '100%',
              p: 1.5,
              mt: 1,
              textAlign: 'center'
            }}>
              <Typography 
                variant="caption" 
                sx={{
                  color: '#2e7d32',
                  fontSize: { xs: '13px', sm: '18px' },
                  lineHeight: '1.5',
                  fontWeight: '500',
                }}
              >
                {language === 'en' 
                  ? `Your institutional email will be: ${formData.studentId || 'XXXXXXXX'}@std.cu.ac.bd` 
                  : `আপনার প্রাতিষ্ঠানিক ইমেল হবে: ${formData.studentId || 'XXXXXXXX'}@std.cu.ac.bd`}
              </Typography>
            </Box>

        {/* Alias Email and Personal Email Row */}
        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2, md: 3 }, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Alias Email */}
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label={language === 'en' ? 'Alias Email (Student Email)' : 'উপনাম ইমেল (ছাত্র ইমেল)'}
              name="aliasEmail"
              value={formData.aliasEmail}
              onChange={onInputChange}
              error={!!errors.aliasEmail}
              helperText={errors.aliasEmail}
              disabled={loading}
              required
              placeholder="username"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    @std.cu.ac.bd
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#001f3f'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003d7a'
                  }
                }
              }}
            />
            <Box sx={{
              background: 'rgba(0, 61, 122, 0.05)',
              border: '1px solid rgba(0, 61, 122, 0.2)',
              borderRadius: '8px',
              p: 1.5,
              mt: 1
            }}>
              <Typography 
                variant="caption" 
                sx={{
                  color: '#003d7a',
                  fontSize: { xs: '11px', sm: '12px' },
                  lineHeight: '1.5'
                }}
              >
                {language === 'en' 
                  ? 'Your alias email will be provided based on availability. Use 2-30 characters: letters, numbers, dots, hyphens or underscores. Do not use personal email patterns like gmail, yahoo, etc.' 
                  : 'আপনার উপনাম ইমেল প্রাপ্যতার ভিত্তিতে প্রদান করা হবে। ২-৩০ অক্ষর ব্যবহার করুন: অক্ষর, সংখ্যা, ডট, হাইফেন বা আন্ডারস্কোর। Gmail, Yahoo এর মতো ব্যক্তিগত ইমেল প্যাটার্ন ব্যবহার করবেন না।'}
              </Typography>
            </Box>
          </Box>

          {/* Personal Email */}
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label={t('primaryEmail')}
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#001f3f'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003d7a'
                  }
                }
              }}
            />
            <Box sx={{
              background: 'rgba(0, 61, 122, 0.05)',
              border: '1px solid rgba(0, 61, 122, 0.2)',
              borderRadius: '8px',
              p: 1.5,
              mt: 1
            }}>
              <Typography 
                variant="caption" 
                sx={{
                  color: '#003d7a',
                  fontSize: { xs: '11px', sm: '12px' },
                  lineHeight: '1.5'
                }}
              >
                {t('emailWarningFormal')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInformation;
