import React, { useState } from 'react';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { ErrorAlert } from '../ErrorAlert';
import { ErrorRetry } from '../ErrorRetry';

// Example 1: Component with error boundary
export function ExampleComponentWithBoundary() {
  const [data, setData] = useState<any>(null);
  const { error, handleError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      clearError();
      // Simulated API call
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      await handleError(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Example: Error Handling</h2>

      {error && <ErrorAlert error={error} onDismiss={clearError} className="mb-4" />}

      <button
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Fetch Data
      </button>

      {data && <div className="mt-4">Data loaded successfully!</div>}
    </div>
  );
}

// Example 2: Component with retry
export function ExampleComponentWithRetry() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorRetry error={error} onRetry={fetchData} />;
  }

  return (
    <div className="p-4">
      {loading ? <div>Loading...</div> : data ? <div>Data: {JSON.stringify(data)}</div> : null}
    </div>
  );
}

// Example 3: Form with error handling
export function ExampleFormWithErrors() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      // Validation
      if (!formData.name || !formData.email) {
        throw new Error('Please fill all fields');
      }

      // Submit
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      alert('Success!');
    } catch (err: any) {
      await handleError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        className="w-full px-4 py-2 border rounded"
      />

      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
      />

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
}
