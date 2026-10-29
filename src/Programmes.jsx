import React, { useState } from 'react';
import './Programmes.css';

const programmeData = [
  { id: 'pyp', title: 'Primary Years Programme (PYP)', desc: 'An inquiry-based programme that encourages curiosity, creativity, and a lifelong love for learning through real-world exploration.' },
  { id: 'myp', title: 'Middle Years Programme (MYP)', desc: 'A globally recognised programme focused on critical thinking, interdisciplinary learning, and real-world connection.' },
  { id: 'dp', title: 'Diploma Programme (DP)', desc: 'A future-focused pathway combining academic study with career-related learning and practical skill development.' },
];

export default function Programmes() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="programmes-section" id="programmes">
      <div className="programmes-header">
        <h2>Our Programmes</h2>
        <p>Shaping minds at every stage of growth.</p>
      </div>

      <div className="programmes-container">
        <div className="tab-buttons">
          {programmeData.map((prog, index) => (
            <button 
              key={prog.id}
              className={`tab-btn ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {prog.title}
            </button>
          ))}
        </div>

        <div className="tab-content card-box">
          <h3>{programmeData[activeTab].title}</h3>
          <p>{programmeData[activeTab].desc}</p>
          <button className="explore-btn">Explore More</button>
        </div>
      </div>
    </section>
  );
}