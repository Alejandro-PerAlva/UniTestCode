/**
 * TestInputList.jsx
 * Allows admins to dynamically add/remove input values for exercise testing.
 * These inputs are mapped to MIPS registers during execution.
 */
import React from 'react';

const TestInputList = ({ inputs, setInputs }) => {
  
  const handleAdd = () => setInputs([...inputs, ""]);
  
  const handleRemove = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  return (
    <div className="form-group" style={{ marginTop: '30px' }}>
      <label>Test Arguments ($a0, $a1...)</label>
      
      <div className="args-container card">
        <span className="args-title">Inputs for Automated Evaluation</span>

        {inputs.map((input, index) => (
          <div key={index} className="dynamic-input-row">
            {/* Visual badge showing which register this input likely targets */}
            <div className="input-index-badge code-font">$a{index}</div>
            
            <input 
              type="text" 
              value={input} 
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Value for $a${index}`}
              className="code-font"
            />
            
            <button 
              type="button" 
              onClick={() => handleRemove(index)} 
              className="icon-btn-danger"
              title="Remove argument"
            >
              &times;
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAdd} className="secondary-btn">
          + Add Test Argument
        </button>
      </div>
    </div>
  );
};

export default TestInputList;