'use client';
import { useEffect, useState } from 'react';
import ImportLogTable from '../components/ImportLogTable';
import './page.module.css';

export default function Page() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('https://backend-task1-a8q1.vercel.app/api/logs');
        // const res = await fetch('https://projectnewbackend1-1.onrender.com/api/logs');
        const data = await res.json();
        setLogs(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const totalSummary = {
    totalFetched: filteredLogs.reduce((sum, l) => sum + l.totalFetched, 0),
    newJobs: filteredLogs.reduce((sum, l) => sum + l.newJobs, 0),
    updatedJobs: filteredLogs.reduce((sum, l) => sum + l.updatedJobs, 0),
    failedJobs: filteredLogs.reduce((sum, l) => sum + (l.failedJobs?.length || 0), 0),
  };

  const handleDateFilter = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = logs.filter((log) => {
      const ts = new Date(log.timestamp);
      return (!from || ts >= from) && (!to || ts <= to);
    });

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Total,New,Updated,Failed']
        .concat(
          filteredLogs.map((l) =>
            [
              new Date(l.timestamp).toLocaleString(),
              l.totalFetched,
              l.newJobs,
              l.updatedJobs,
              l.failedJobs?.length || 0,
            ].join(',')
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'import_logs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <main className="wrapper">
      <div className="container">
        <h1 className="title">Job Import History</h1>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <button onClick={handleDateFilter}>Apply Filter</button>
          <button onClick={handleExport}>⬇️ Export to CSV</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Total Fetched:</strong> {totalSummary.totalFetched} |{' '}
          <strong>New:</strong> {totalSummary.newJobs} |{' '}
          <strong>Updated:</strong> {totalSummary.updatedJobs} |{' '}
          <strong>Failed:</strong> {totalSummary.failedJobs}
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <ImportLogTable logs={currentLogs} />
            <div style={{ marginTop: '16px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    margin: '0 4px',
                    padding: '6px 10px',
                    background: page === currentPage ? '#333' : '#eee',
                    color: page === currentPage ? '#fff' : '#000',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
