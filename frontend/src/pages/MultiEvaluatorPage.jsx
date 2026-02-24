import React, { useState, useEffect } from 'react';
import API_URL from '../config/api';

import ExerciseSelector from '../components/ui/evaluator/ExerciseSelector';
import SolutionUploader from '../components/ui/evaluator/SolutionUploader';
import SimpleResultItem from '../components/ui/evaluator/SimpleResultItem';

import '../styles/pages/MultiEvaluator.css';

const MultiEvaluatorPage = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchAvailableExercises();
  }, []);

  const fetchAvailableExercises = async () => {
    const session = JSON.parse(localStorage.getItem('mips_session') || '{}');
    const token = session?.token;
    try {
      setFetching(true);
      const res = await fetch(`${API_URL}/exercises`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const extractedArray = data.data || data;
      const visibleOnly = (Array.isArray(extractedArray) ? extractedArray : [])
        .filter(ex => ex.visible !== false && ex.visible !== "false");
      setExercises(visibleOnly);
    } catch (err) {
      setError("No se pudieron cargar los ejercicios.");
    } finally {
      setFetching(false);
    }
  };

  const handleToggleExercise = (id) => {
    setResults([]); 
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults([]);
      setError(null);
    }
  };

  const handleSubmission = async () => {
    if (selectedIds.length === 0 || !file) return;
    setLoading(true);
    setResults([]);
    setError(null);

    const session = JSON.parse(localStorage.getItem('mips_session') || '{}');
    const token = session?.token;
    const formData = new FormData();
    formData.append('exerciseIds', JSON.stringify(selectedIds)); 
    formData.append('code', file);

    try {
      const res = await fetch(`${API_URL}/evaluador/submit-multiple`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al evaluar");
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatus = (res) => {
    const output = String(res.output || '').trim();
    if (output === "-1" || output === "-2") return 'warning';
    return res.passed ? 'passed' : 'failed';
  };

  return (
    <div className="evaluator-container fade-in-up">
      <div className="evaluator-card">
        <header>
          <h2>📂 Multi-Task Evaluator</h2>
          <p className="evaluator-subtitle">Selecciona los retos y valida el estado de tu solución.</p>
        </header>
        
        {fetching ? (
          <div className="empty-state-container">
            <div className="spinner-small"></div>
            <p>Buscando ejercicios...</p>
          </div>
        ) : exercises.length === 0 ? (
          /* Placeholder si no hay ejercicios visibles */
          <div className="empty-state-container" style={{padding: '40px', border: '1px dashed var(--border)', borderRadius: '12px'}}>
            <p style={{color: 'var(--text-muted)'}}>⚠️ No hay ejercicios disponibles actualmente.</p>
          </div>
        ) : (
          <>
            <ExerciseSelector 
              exercises={exercises} 
              selectedIds={selectedIds} 
              onToggle={handleToggleExercise} 
            />
            <SolutionUploader 
              file={file} 
              selectedCount={selectedIds.length} 
              loading={loading} 
              onFileChange={handleFileChange} 
              onSubmit={handleSubmission}
              /* Pasamos si debe estar bloqueado */
              isDisabled={selectedIds.length === 0} 
            />
          </>
        )}

        {error && <div className="status-msg error">❌ {error}</div>}

        <section className="simple-results-list">
          {results.map((rawRes, index) => {
            const status = calculateStatus(rawRes);
            const exerciseData = exercises.find(ex => String(ex.id) === String(rawRes.exerciseId));
            const displayName = exerciseData ? (exerciseData.title || exerciseData.titulo) : `Ejercicio ${rawRes.exerciseId}`;

            return (
              <SimpleResultItem 
                key={`${rawRes.exerciseId}-${index}`} 
                name={displayName} 
                status={status} 
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default MultiEvaluatorPage;