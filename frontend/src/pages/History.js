import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const navigate = useNavigate();
  const { setSearchResults, setSearchQuery } = useSearch();
  
  // Fetch search history
  const fetchHistory = async (page = 1) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/history?page=${page}&per_page=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      
      const data = await response.json();
      
      setHistory(data.history);
      setPagination({
        currentPage: data.current_page,
        totalPages: data.pages,
        totalItems: data.total
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Load history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);
  
  // Handle page change
  const handlePageChange = (page) => {
    fetchHistory(page);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Handle view results
  const handleViewResults = (searchItem) => {
    setSearchResults(searchItem.results);
    setSearchQuery(searchItem.query);
    navigate('/product');
  };
  
  // Handle delete history item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this search history item?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }
      
      // Refresh history
      fetchHistory(pagination.currentPage);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="history-page">
      <div className="container">
        <h1>Search History</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading search history...</p>
          </div>
        ) : (
          <>
            {history.length === 0 ? (
              <div className="no-history">
                <i className="fas fa-history"></i>
                <h3>No search history found</h3>
                <p>Your search history will appear here once you start searching for products.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/product')}
                >
                  Start Searching
                </button>
              </div>
            ) : (
              <div className="history-list">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Query</th>
                        <th>Date</th>
                        <th>Results</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td>{item.query}</td>
                          <td>{formatDate(item.timestamp)}</td>
                          <td>{item.results ? item.results.length : 0} products</td>
                          <td>
                            <div className="history-actions">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleViewResults(item)}
                              >
                                View Results
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination-container">
                    <nav aria-label="Search history pagination">
                      <ul className="pagination">
                        <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <li 
                            key={i} 
                            className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
