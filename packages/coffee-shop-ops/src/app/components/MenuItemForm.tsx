'use client';

import { useState, FormEvent, useRef } from 'react';
import { MenuItem } from '@/types/models';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price ($) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          className={`mt-1 block w-full rounded-md border ${
            errors.price ? 'border-red-300' : 'border-gray-300'
          } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.category ? 'border-red-300' : 'border-gray-300'
          } shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        
        {/* Image Upload */}
        <div 
          className={`mt-1 flex justify-center rounded-md border-2 border-dashed p-6 ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-2 text-center">
            <div className="flex flex-col items-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                  <span>Choose a file</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            
            {selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>
                <div className="mt-2 flex justify-center">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    className="max-h-64 w-auto object-contain rounded-md"
                  />
                </div>
                <div className="mt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>
            )}
            
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>
        </div>
        
        {/* Image URL Field */}
        <div className="mt-4">
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        {/* Image Preview */}
        {formData.image_url && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <div className="relative w-full overflow-hidden rounded-md border border-gray-300">
              {imagePreviewError ? (
                <div className="flex h-64 w-full items-center justify-center bg-gray-100 p-4 text-center">
                  <p className="text-red-500">{imagePreviewError}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={formData.image_url}
                    alt="Menu item preview"
                    className="max-h-96 object-contain"
                    onError={handleImageError}
                  />
                  <div className="mt-2 mb-2 flex items-center justify-center">
                    <a 
                      href={formData.image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View full size
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_available"
          name="is_available"
          checked={formData.is_available}
          onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
          Available
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Item' : 'Create Item'}
        </button>
      </div>
    </form>
  );
}