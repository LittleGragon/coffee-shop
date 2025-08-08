'use client';

import { useState, FormEvent, useRef } from 'react';
import { MenuItem } from '@/types/models';
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Switch, 
  Typography, 
  Box, 
  Paper, 
  InputAdornment,
  FormHelperText,
  Divider,
  Link as MuiLink
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

interface MenuItemFormProps {
  initialData?: Partial<MenuItem>;
  onSubmit: (data: Partial<MenuItem>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function MenuItemForm({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting
}: MenuItemFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    image_url: '',
    is_available: true,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviewError, setImagePreviewError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear image preview error when URL changes
      if (name === 'image_url') {
        setImagePreviewError(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        setSelectedFile(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update the image URL in the form data
      setFormData(prev => ({ ...prev, image_url: data.url }));
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  const handleImageError = () => {
    setImagePreviewError('Failed to load image. Please check the URL.');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Name Field */}
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          required
          variant="outlined"
        />

        {/* Price Field */}
        <TextField
          fullWidth
          id="price"
          name="price"
          label="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          inputProps={{
            step: "0.01",
            min: "0"
          }}
          variant="outlined"
        />
      </Box>

      {/* Category Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          id="category"
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          error={!!errors.category}
          helperText={errors.category}
          required
          variant="outlined"
        />
      </Box>

      {/* Description Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          value={formData.description || ''}
          onChange={handleChange}
          multiline
          rows={3}
          variant="outlined"
        />
      </Box>

      {/* Image Upload Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Image
        </Typography>
        
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
            bgcolor: isDragging ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            Drag and drop an image here, or click to select a file
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG, GIF up to 10MB
          </Typography>
        </Paper>
        
        {uploadError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {uploadError}
          </FormHelperText>
        )}

        {/* Selected File Preview */}
        {selectedFile && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selected: {selectedFile.name}
            </Typography>
            
            <Box sx={{ mt: 1, mb: 2, display: 'flex', justifyContent: 'center' }}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
              />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isUploading}
              startIcon={<CloudUploadIcon />}
              size="small"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </Box>
        )}

        {/* Image URL Field */}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            id="image_url"
            name="image_url"
            label="Image URL"
            value={formData.image_url || ''}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Image Preview */}
        {formData.image_url && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Image Preview:
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
              {imagePreviewError ? (
                <Box sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="body2" color="inherit">
                    {imagePreviewError}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={formData.image_url}
                    alt="Menu item preview"
                    style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={handleImageError}
                  />
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <MuiLink 
                      href={formData.image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      View full size
                    </MuiLink>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Box>

      {/* Availability Toggle */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.is_available}
              onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
              name="is_available"
              color="primary"
            />
          }
          label="Available"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Form Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Item' : 'Create Item'}
        </Button>
      </Box>
    </Box>
  );
}