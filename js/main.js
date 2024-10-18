import React from 'react';
import ReactDOM from 'react-dom';
import ThreeDModelViewer from '../src/components/ThreeDModelViewer.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Data Center PM Software initialized');

    // Initialize 3D Model Viewer
    const modelViewerContainer = document.getElementById('three-d-model');
    ReactDOM.render(<ThreeDModelViewer />, modelViewerContainer);

    // Update days remaining
    function updateDaysRemaining() {
        const endDate = new Date(document.getElementById('end-date').textContent);
        const today = new Date();
        const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        document.getElementById('days-remaining').textContent = daysRemaining;
    }

    // Update budget information
    function updateBudgetInfo() {
        const totalBudget = 10000000;
        const spent = parseFloat(document.getElementById('budget-spent').textContent.replace(/,/g, ''));
        const remaining = totalBudget - spent;
        document.getElementById('budget-remaining').textContent = remaining.toLocaleString();
    }

    // Initialize dashboard
    updateDaysRemaining();
    updateBudgetInfo();

    // Simulating real-time updates (for demonstration purposes)
    setInterval(() => {
        // Update progress randomly
        const newProgress = Math.floor(Math.random() * 100);
        document.querySelector('.progress').style.width = `${newProgress}%`;
        document.querySelector('.progress').textContent = `${newProgress}%`;

        // Update spent budget randomly
        const newSpent = 6500000 + Math.floor(Math.random() * 1000000);
        document.getElementById('budget-spent').textContent = newSpent.toLocaleString();
        updateBudgetInfo();
    }, 5000); // Update every 5 seconds

    // Basic navigation handling
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});