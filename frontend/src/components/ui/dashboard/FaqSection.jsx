import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FaqSection = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-vertical-section">
      <h2 className="section-label">PREGUNTAS FRECUENTES</h2>
      <div className="faq-vertical-list">
        {items.map((faq, index) => (
          <div
            key={index}
            className={`faq-full-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFaq(index)}
            role="button"
            tabIndex={0}
          >
            <div className="faq-full-head">
              <span>{faq.q}</span>
              <span className="faq-toggle-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-full-body">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

FaqSection.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    q: PropTypes.string.isRequired,
    a: PropTypes.string.isRequired,
  })).isRequired,
};

export default FaqSection;