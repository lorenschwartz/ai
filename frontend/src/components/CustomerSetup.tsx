// Customer Setup Component for AI-Mi
import React, { useState, useRef, useEffect } from 'react';
import { User, MapPin, Coffee, AlertCircle } from 'lucide-react';
import { useCreateCustomer } from '../hooks/useApi';
import type { CustomerPreferences } from '../types/api';

interface CustomerSetupProps {
  onCustomerCreated: (customerId: string) => void;
  className?: string;
}

export const CustomerSetup: React.FC<CustomerSetupProps> = ({
  onCustomerCreated,
  className = '',
}) => {
  const [step, setStep] = useState<'basic' | 'preferences'>('basic');
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    tableNumber: '',
  });
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    spiceLevel: 'medium' as const,
  });

  const createCustomerMutation = useCreateCustomer();

  // Add keyboard listener for Enter key on preferences step
  useEffect(() => {
    if (step !== 'preferences') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        !createCustomerMutation.isLoading
      ) {
        e.preventDefault();
        submitButtonRef.current?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [step, createCustomerMutation.isLoading]);

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      setStep('preferences');
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createCustomerMutation.mutateAsync({
        ...formData,
        preferences: {
          ...preferences,
          dietaryRestrictions: preferences.dietaryRestrictions?.filter(r =>
            r.trim()
          ),
          allergies: preferences.allergies?.filter(a => a.trim()),
        },
      });

      if (result.success && result.data) {
        onCustomerCreated(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  const addDietaryRestriction = (restriction: string) => {
    if (
      restriction &&
      !preferences.dietaryRestrictions?.includes(restriction)
    ) {
      setPreferences(prev => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), restriction],
      }));
    }
  };

  const removeDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions:
        prev.dietaryRestrictions?.filter(r => r !== restriction) || [],
    }));
  };

  const addAllergy = (allergy: string) => {
    if (allergy && !preferences.allergies?.includes(allergy)) {
      setPreferences(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), allergy],
      }));
    }
  };

  const removeAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies?.filter(a => a !== allergy) || [],
    }));
  };

  const commonDietaryRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Low-Carb',
    'Halal',
    'Kosher',
  ];

  const commonAllergies = [
    'Nuts',
    'Shellfish',
    'Dairy',
    'Eggs',
    'Soy',
    'Wheat',
    'Fish',
    'Sesame',
  ];

  if (step === 'basic') {
    return (
      <div
        className={`max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
      >
        <div className='text-center mb-6'>
          <User className='h-12 w-12 mx-auto text-blue-500 mb-4' />
          <h2 className='text-2xl font-bold text-gray-900'>
            Welcome to AI-Mi!
          </h2>
          <p className='text-gray-600 mt-2'>
            Let's get you set up for the best dining experience
          </p>
        </div>

        <form onSubmit={handleBasicSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Name *
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter your name'
              required
            />
          </div>

          <div>
            <label
              htmlFor='tableNumber'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              <MapPin className='inline h-4 w-4 mr-1' />
              Table Number
            </label>
            <input
              type='text'
              id='tableNumber'
              value={formData.tableNumber}
              onChange={e =>
                setFormData(prev => ({ ...prev, tableNumber: e.target.value }))
              }
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='e.g., 12'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium'
          >
            Continue to Preferences
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      <div className='text-center mb-6'>
        <Coffee className='h-12 w-12 mx-auto text-green-500 mb-4' />
        <h2 className='text-2xl font-bold text-gray-900'>Your Preferences</h2>
        <p className='text-gray-600 mt-2'>
          Help us personalize your dining experience
        </p>
      </div>

      <form onSubmit={handlePreferencesSubmit} className='space-y-6'>
        {/* Dietary Restrictions */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Dietary Restrictions
          </label>
          <div className='grid grid-cols-2 gap-2 mb-3'>
            {commonDietaryRestrictions.map(restriction => (
              <button
                key={restriction}
                type='button'
                onClick={() =>
                  preferences.dietaryRestrictions?.includes(restriction)
                    ? removeDietaryRestriction(restriction)
                    : addDietaryRestriction(restriction)
                }
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  preferences.dietaryRestrictions?.includes(restriction)
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
          {preferences.dietaryRestrictions &&
            preferences.dietaryRestrictions.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {preferences.dietaryRestrictions.map(restriction => (
                  <span
                    key={restriction}
                    className='inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'
                  >
                    {restriction}
                    <button
                      type='button'
                      onClick={() => removeDietaryRestriction(restriction)}
                      className='ml-1 hover:text-green-600'
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
        </div>

        {/* Allergies */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <AlertCircle className='inline h-4 w-4 mr-1 text-red-500' />
            Allergies
          </label>
          <div className='grid grid-cols-2 gap-2 mb-3'>
            {commonAllergies.map(allergy => (
              <button
                key={allergy}
                type='button'
                onClick={() =>
                  preferences.allergies?.includes(allergy)
                    ? removeAllergy(allergy)
                    : addAllergy(allergy)
                }
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  preferences.allergies?.includes(allergy)
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
          {preferences.allergies && preferences.allergies.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {preferences.allergies.map(allergy => (
                <span
                  key={allergy}
                  className='inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'
                >
                  {allergy}
                  <button
                    type='button'
                    onClick={() => removeAllergy(allergy)}
                    className='ml-1 hover:text-red-600'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Spice Level */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Spice Preference
          </label>
          <div className='grid grid-cols-4 gap-2'>
            {(['mild', 'medium', 'hot', 'extra-hot'] as const).map(level => (
              <button
                key={level}
                type='button'
                onClick={() =>
                  setPreferences(prev => ({ ...prev, spiceLevel: level }))
                }
                className={`p-2 text-sm rounded-lg border transition-colors capitalize ${
                  preferences.spiceLevel === level
                    ? 'bg-orange-100 border-orange-300 text-orange-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className='flex space-x-3'>
          <button
            type='button'
            onClick={() => setStep('basic')}
            className='flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium'
          >
            Back
          </button>
          <button
            ref={submitButtonRef}
            type='submit'
            disabled={createCustomerMutation.isLoading}
            className='flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:opacity-50'
          >
            {createCustomerMutation.isLoading
              ? 'Creating...'
              : 'Start Chatting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSetup;
