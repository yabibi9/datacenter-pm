import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import ChangeOrderForm from '../components/ChangeOrderForm';
import PayApplicationForm from '../components/PayApplicationForm';

function FinancialManagement() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const [totalBudget, setTotalBudget] = useState(10000000);
  const [spent, setSpent] = useState(6500000);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [changeOrders, setChangeOrders] = useState([]);
  const [payApplications, setPayApplications] = useState([]);

  // Fetch initial data from the backend
  useEffect(() => {
    axios.get('/api/budget-categories').then((res) => setBudgetCategories(res.data));
    axios.get('/api/change-orders').then((res) => setChangeOrders(res.data));
    axios.get('/api/pay-applications').then((res) => setPayApplications(res.data));
  }, []);

  const addBudgetCategory = (category) => {
    axios.post('/api/budget-categories', category).then((res) => {
      setBudgetCategories([...budgetCategories, res.data]);
      const newTotal = totalBudget + parseFloat(category.amount);
      setTotalBudget(newTotal);
      updateChartData(chartRef.current, spent, newTotal - spent);
    });
  };

  const addChangeOrder = (order) => {
    axios.post('/api/change-orders', order).then((res) => {
      setChangeOrders([...changeOrders, res.data]);
      const newSpent = spent + parseFloat(order.amount);
      setSpent(newSpent);
      updateChartData(chartRef.current, newSpent, totalBudget - newSpent);
    });
  };

  const addPayApplication = (application) => {
    axios.post('/api/pay-applications', application).then((res) => {
      setPayApplications([...payApplications, res.data]);
      const newSpent = spent + parseFloat(application.amount);
      setSpent(newSpent);
      updateChartData(chartRef.current, newSpent, totalBudget - newSpent);
    });
  };

  const initializeChart = () => {
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Spent', 'Remaining'],
        datasets: [
          {
            data: [spent, totalBudget - spent],
            backgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      },
    });
  };

  const updateChartData = (chart, newSpent, remaining) => {
    chart.data.datasets[0].data = [newSpent, remaining];
    chart.update();
  };

  useEffect(() => {
    initializeChart();
    return () => chartRef.current && chartRef.current.destroy();
  }, [spent, totalBudget]);

  return (
    <div className="financial-management">
      <h1>Financial Management</h1>

      <section className="budget-overview">
        <h2>Project Budget Overview</h2>
        <canvas ref={canvasRef}></canvas>
      </section>

      <section className="budget-builder">
        <h2>Budget Builder</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const category = {
              name: e.target.categoryName.value,
              amount: parseFloat(e.target.amount.value),
            };
            addBudgetCategory(category);
            e.target.reset();
          }}
        >
          <input type="text" name="categoryName" placeholder="Category Name" required />
          <input type="number" name="amount" placeholder="Amount" required />
          <button type="submit">Add Category</button>
        </form>

        <ul>
          {budgetCategories.map((cat, index) => (
            <li key={index}>
              {cat.name}: ${cat.amount.toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section className="change-management">
        <h2>Change Management</h2>
        <ChangeOrderForm onSubmit={addChangeOrder} />
        <ul>
          {changeOrders.map((order, index) => (
            <li key={index}>
              {order.id}: {order.description} - ${order.amount} ({order.status})
            </li>
          ))}
        </ul>
      </section>

      <section className="pay-applications">
        <h2>Pay Applications</h2>
        <PayApplicationForm onSubmit={addPayApplication} />
        <ul>
          {payApplications.map((app, index) => (
            <li key={index}>
              {app.trade} - {app.month}: ${app.amount} ({app.status})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default FinancialManagement;
