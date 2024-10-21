import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ChangeOrderForm from '../components/ChangeOrderForm';
import PayApplicationForm from '../components/PayApplicationForm';

function FinancialManagement() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const [totalBudget, setTotalBudget] = useState(10000000);
  const [spent, setSpent] = useState(6500000);
  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [changeOrders, setChangeOrders] = useState([]);
  const [payApplications, setPayApplications] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    breakdown: true,
    changeManagement: true,
    payApplications: true
  });
  const [expandedDivisions, setExpandedDivisions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchDivisions();
    fetchData();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('/api/divisions');
      setDivisions(response.data);
      const initialExpandedState = response.data.reduce((acc, division) => {
        acc[division.id] = false;
        return acc;
      }, {});
      setExpandedDivisions(initialExpandedState);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [budgetItemsRes, budgetCategoriesRes, changeOrderRes, payAppRes] = await Promise.all([
        axios.get('/api/budget-items'),
        axios.get('/api/budget-categories'),
        axios.get('/api/change-orders'),
        axios.get('/api/pay-applications'),
      ]);

      setBudgetItems(budgetItemsRes.data || []);
      setBudgetCategories(budgetCategoriesRes.data || []);
      setChangeOrders(changeOrderRes.data || []);
      setPayApplications(payAppRes.data || []);

      calculateTotals(budgetItemsRes.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      setIsLoading(false);
    }
  };

  const calculateTotals = (items) => {
    const total = items.reduce((sum, item) => sum + item.bidAmount, 0);
    const spentAmount = items.reduce((sum, item) => sum + (item.actualBuyout || 0), 0);
    setTotalBudget(total);
    setSpent(spentAmount);
  };

  const addChangeOrder = (order) => {
    axios.post('/api/change-orders', order)
      .then((res) => {
        setChangeOrders([...changeOrders, res.data]);
        const newSpent = spent + parseFloat(order.amount);
        setSpent(newSpent);
        updateChartData(chartRef.current, newSpent, totalBudget - newSpent);
      })
      .catch((error) => {
        console.error('Error adding change order:', error);
        alert('Failed to add change order. Please try again.');
      });
  };

  const addPayApplication = (application) => {
    axios.post('/api/pay-applications', application)
      .then((res) => {
        setPayApplications([...payApplications, res.data]);
        const newSpent = spent + parseFloat(application.amount);
        setSpent(newSpent);
        updateChartData(chartRef.current, newSpent, totalBudget - newSpent);
      })
      .catch((error) => {
        console.error('Error adding pay application:', error);
        alert('Failed to add pay application. Please try again.');
      });
  };

  const handleAddBudgetItem = async (e) => {
    e.preventDefault();
    const newItem = {
      scope: selectedDivision,
      bidAmount: parseFloat(e.target.bidAmount.value),
      siteShellContract: parseFloat(e.target.siteShellContract.value),
      deferTIContract: parseFloat(e.target.deferTIContract.value),
    };
    await addBudgetItem(newItem);
    e.target.reset();
  };

  const addBudgetItem = async (item) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/budget-items', item);
      const newItems = [...budgetItems, res.data];
      setBudgetItems(newItems);
      calculateTotals(newItems);
    } catch (err) {
      console.error('Error adding budget item:', err);
      alert('Failed to add budget item. Please try again.');
    }
    setIsSubmitting(false);
  };

  const updateBudgetItem = async (id, updates) => {
    try {
      const res = await axios.put(`/api/budget-items/${id}`, updates);
      const updatedItems = budgetItems.map(item => 
        item.id === id ? { ...item, ...res.data } : item
      );
      setBudgetItems(updatedItems);
      calculateTotals(updatedItems);
    } catch (error) {
      console.error('Error updating budget item:', error);
      alert('Failed to update budget item. Please try again.');
    }
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const updateChartData = (chart, newSpent, remaining) => {
    chart.data.datasets[0].data = [newSpent, remaining];
    chart.update();
  };

  useEffect(() => {
    if (!isLoading && !error) {
      initializeChart();
    }
    return () => chartRef.current && chartRef.current.destroy();
  }, [isLoading, error, spent, totalBudget]);

  const filteredItems = budgetItems.filter(item =>
    item.scope.toLowerCase().includes(search.toLowerCase())
  );

  const onDragEnd = (result) => {
    // Implement drag and drop logic here
    // For now, this is just a placeholder
    console.log('Drag ended:', result);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const toggleDivision = (divisionId) => {
    setExpandedDivisions(prev => ({...prev, [divisionId]: !prev[divisionId]}));
  };

  const renderBudgetCard = (item, index) => (
    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="budget-card"
        >
          <div className="budget-card-header">{item.scope}</div>
          <div className="budget-card-body">
            <div className="budget-card-row">
              <span>Bid Amount:</span>
              <span>${item.bidAmount.toLocaleString()}</span>
            </div>
            <div className="budget-card-row">
              <span>Site & Shell:</span>
              <span>${item.siteShellContract.toLocaleString()}</span>
            </div>
            <div className="budget-card-row">
              <span>Defer to TI:</span>
              <span>${item.deferTIContract.toLocaleString()}</span>
            </div>
            <div className="budget-card-row">
              <span>Actual Buyout:</span>
              <input
                type="number"
                min="0"
                value={item.actualBuyout || ''}
                onChange={(e) =>
                  updateBudgetItem(item.id, {
                    actualBuyout: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="budget-card-row">
              <span>Difference:</span>
              <span className={item.siteShellContract + item.deferTIContract - (item.actualBuyout || 0) >= 0 ? 'positive' : 'negative'}>
                ${(item.siteShellContract + item.deferTIContract - (item.actualBuyout || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="financial-management">
      <h1>Financial Management</h1>
      
      <section className={`budget-overview expandable ${expandedSections.overview ? 'expanded' : ''}`}>
        <h2 onClick={() => toggleSection('overview')}>Project Budget Overview</h2>
        {expandedSections.overview && (
          <>
            <div className="chart-container">
              <canvas ref={canvasRef}></canvas>
            </div>
            <div className="budget-summary">
              <div className="summary-item">
                <h3>Total Budget</h3>
                <p>${totalBudget.toLocaleString()}</p>
              </div>
              <div className="summary-item">
                <h3>Spent</h3>
                <p>${spent.toLocaleString()}</p>
              </div>
              <div className="summary-item">
                <h3>Remaining</h3>
                <p>${(totalBudget - spent).toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
      </section>

      <section className={`budget-breakdown expandable ${expandedSections.breakdown ? 'expanded' : ''}`}>
        <h2 onClick={() => toggleSection('breakdown')}>Budget Breakdown</h2>
        {expandedSections.breakdown && (
          <>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search Scope"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                <option value="">All Divisions</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.name}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              {divisions.map((division) => (
                <Droppable key={division.id} droppableId={`division-${division.id}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <div className="division-header" onClick={() => toggleDivision(division.id)}>
                        <h3>{division.name}</h3>
                        <span>{expandedDivisions[division.id] ? '▼' : '▶'}</span>
                      </div>
                      {expandedDivisions[division.id] && (
                        <div className="budget-cards">
                          {filteredItems
                            .filter(item => item.scope === division.name)
                            .map((item, index) => renderBudgetCard(item, index))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
            <div className="pagination">
              {/* Add pagination controls here */}
            </div>
            <div className="add-budget-item">
  <h3>Add Budget Item</h3>
  <form onSubmit={handleAddBudgetItem}>
    <div className="form-row">
      <label htmlFor="division-select">Division:</label>
      <select
        id="division-select"
        name="scope"
        value={selectedDivision}
        onChange={(e) => setSelectedDivision(e.target.value)}
        required
      >
        <option value="">Select Division</option>
        {divisions.map((division) => (
          <option key={division.id} value={division.name}>
            {division.name}
          </option>
        ))}
      </select>
    </div>
    <div className="form-row">
      <label htmlFor="bid-amount">Bid Amount:</label>
      <input type="number" id="bid-amount" name="bidAmount" required />
    </div>
    <div className="form-row">
      <label htmlFor="site-shell">Site & Shell Contract:</label>
      <input type="number" id="site-shell" name="siteShellContract" required />
    </div>
    <div className="form-row">
      <label htmlFor="defer-ti">Defer to TI Contract:</label>
      <input type="number" id="defer-ti" name="deferTIContract" required />
    </div>
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Adding...' : 'Add Item'}
    </button>
  </form>
</div>
          </>
        )}
      </section>

      <section className={`change-management expandable ${expandedSections.changeManagement ? 'expanded' : ''}`}>
        <h2 onClick={() => toggleSection('changeManagement')}>Change Management</h2>
        {expandedSections.changeManagement && (
          <>
            <ChangeOrderForm onSubmit={addChangeOrder} />
            <ul className="change-order-list">
              {changeOrders.map((order) => (
                <li key={order.id} className="change-order-item">
                  <span className="description">{order.description}</span>
                  <span className="amount">${order.amount.toLocaleString()}</span>
                  <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className={`pay-applications expandable ${expandedSections.payApplications ? 'expanded' : ''}`}>
        <h2 onClick={() => toggleSection('payApplications')}>Pay Applications</h2>
        {expandedSections.payApplications && (
          <>
            <PayApplicationForm onSubmit={addPayApplication} />
            <ul className="pay-application-list">
              {payApplications.map((app) => (
                <li key={app.id} className="pay-application-item">
                  <span className="trade">{app.trade}</span>
                  <span className="month">{app.month}</span>
                  <span className="amount">${app.amount.toLocaleString()}</span>
                  <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

export default FinancialManagement;