// components/UserDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Userdashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Mock data
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Calculus Made Easy",
      author: "Silvanus Thompson",
      subject: "math",
      description: "A comprehensive guide to calculus concepts with practical examples and exercises.",
      status: "available",
      isNew: true,
      cover: "📘",
      totalCopies: 5,
      availableCopies: 3
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      author: "John Peterson",
      subject: "math",
      description: "Advanced mathematical theories and applications for university students.",
      status: "available",
      isNew: false,
      cover: "📗",
      totalCopies: 2,
      availableCopies: 2
    },
    {
      id: 3,
      title: "Psychology 101",
      author: "Paul Kleinman",
      subject: "psychology",
      description: "Introduction to psychology covering major theories and concepts.",
      status: "available",
      isNew: true,
      cover: "📙",
      totalCopies: 3,
      availableCopies: 3
    },
    {
      id: 4,
      title: "Cognitive Psychology",
      author: "Robert Sternberg",
      subject: "psychology",
      description: "In-depth study of cognitive processes and mental functions.",
      status: "available",
      isNew: false,
      cover: "📕",
      totalCopies: 3,
      availableCopies: 3
    },
    {
      id: 5,
      title: "English Literature",
      author: "William Shakespeare",
      subject: "literature",
      description: "Classic English literature works and analysis.",
      status: "available",
      isNew: true,
      cover: "📓",
      totalCopies: 4,
      availableCopies: 4
    },
    {
      id: 6,
      title: "Modern Poetry",
      author: "Emily Dickinson",
      subject: "literature",
      description: "Collection of modern poetry and literary analysis.",
      status: "borrowed",
      isNew: false,
      cover: "📒",
      totalCopies: 2,
      availableCopies: 0
    }
  ]);

  const [borrowedBooks, setBorrowedBooks] = useState([
    {
      id: 1,
      bookId: 6,
      title: "Modern Poetry",
      author: "Emily Dickinson",
      borrowDate: "2024-01-10",
      dueDate: "2024-01-24",
      status: "borrowing",
      daysRemaining: 5
    }
  ]);

  const [penalties, setPenalties] = useState([
    // Initially empty
  ]);

  const announcements = [
    {
      id: 1,
      title: "Library Holiday Schedule",
      content: "The library will be closed on January 26th for Republic Day.",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "New Book Arrivals",
      content: "Check out our new collection of science fiction and fantasy books!",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Extended Hours",
      content: "Library hours extended until 8 PM on weekdays starting next month.",
      date: "2024-01-08"
    }
  ];

  const subjects = {
    all: "All Subjects",
    math: "Mathematics",
    psychology: "Psychology",
    literature: "Literature",
    science: "Science",
    history: "History"
  };

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      
      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        if (userData.role === 'admin') {
          navigate("/admin-dashboard");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Filter books based on search and subject
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBorrow = (bookId) => {
    const bookToBorrow = books.find(book => book.id === bookId);
    
    if (!bookToBorrow || bookToBorrow.availableCopies <= 0) return;

    // Calculate dates
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14);

    const formattedBorrowDate = borrowDate.toISOString().split('T')[0];
    const formattedDueDate = dueDate.toISOString().split('T')[0];

    // Add to borrowed books
    const newBorrowedBook = {
      id: Date.now(),
      bookId: bookToBorrow.id,
      title: bookToBorrow.title,
      author: bookToBorrow.author,
      borrowDate: formattedBorrowDate,
      dueDate: formattedDueDate,
      status: "borrowing",
      daysRemaining: 14
    };

    setBorrowedBooks(prev => [...prev, newBorrowedBook]);

    // Update book available copies
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, availableCopies: book.availableCopies - 1, status: book.availableCopies - 1 === 0 ? "borrowed" : "available" }
        : book
    ));

    alert(`"${bookToBorrow.title}" borrowed successfully! Due date: ${formattedDueDate}`);
  };

  const handleReturn = (borrowId) => {
    const borrowedBook = borrowedBooks.find(book => book.id === borrowId);
    
    if (!borrowedBook) return;

    const returnDate = new Date();
    const formattedReturnDate = returnDate.toISOString().split('T')[0];

    // Check if book is overdue and add penalty
    const dueDate = new Date(borrowedBook.dueDate);
    const isOverdue = returnDate > dueDate;
    
    if (isOverdue) {
      const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      const penaltyAmount = daysOverdue * 5;
      
      const newPenalty = {
        id: Date.now(),
        bookTitle: borrowedBook.title,
        reason: `Overdue return - ${daysOverdue} day(s) late`,
        amount: penaltyAmount,
        status: "unpaid",
        dueDate: new Date(returnDate.setDate(returnDate.getDate() + 7)).toISOString().split('T')[0]
      };
      
      setPenalties(prev => [...prev, newPenalty]);
    }

    // Update borrowed book status
    setBorrowedBooks(prev => prev.map(book => 
      book.id === borrowId 
        ? { 
            ...book, 
            status: "returned", 
            returnDate: formattedReturnDate 
          } 
        : book
    ));

    // Update book available copies
    setBooks(prev => prev.map(book => 
      book.id === borrowedBook.bookId 
        ? { ...book, availableCopies: book.availableCopies + 1, status: "available" }
        : book
    ));

    alert(`"${borrowedBook.title}" returned successfully!`);
  };

  const handlePayPenalty = (penaltyId) => {
    setPenalties(prev => prev.map(penalty => 
      penalty.id === penaltyId ? { ...penalty, status: "paid" } : penalty
    ));
    alert("Penalty paid successfully!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "borrowing": return "#3498db";
      case "overdue": return "#e74c3c";
      case "returned": return "#27ae60";
      default: return "#95a5a6";
    }
  };

  // Calculate days remaining/overdue for borrowed books
  const updatedBorrowedBooks = borrowedBooks.map(book => {
    if (book.status === "borrowing") {
      const today = new Date();
      const dueDate = new Date(book.dueDate);
      const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining < 0) {
        return {
          ...book,
          status: "overdue",
          daysOverdue: Math.abs(daysRemaining)
        };
      }
      
      return {
        ...book,
        daysRemaining: Math.max(0, daysRemaining)
      };
    }
    return book;
  });

  const renderBooksTab = () => (
    <div className="tab-content">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="subject-filters">
        {Object.entries(subjects).map(([key, label]) => (
          <button
            key={key}
            className={`subject-btn ${selectedSubject === key ? 'active' : ''}`}
            onClick={() => setSelectedSubject(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="new-arrivals">
        <h3>🌟 New Arrivals</h3>
        <div className="book-grid">
          {books.filter(book => book.isNew && book.status === "available").map(book => (
            <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
          ))}
        </div>
      </div>

      <div className="all-books">
        <h3>All Books ({filteredBooks.filter(book => book.status === "available").length})</h3>
        <div className="book-grid">
          {filteredBooks.filter(book => book.status === "available").map(book => (
            <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderBorrowedTab = () => (
    <div className="tab-content">
      <div className="borrowed-section">
        <h3>Your Borrowed Books ({updatedBorrowedBooks.filter(book => book.status !== "returned").length})</h3>
        {updatedBorrowedBooks.length === 0 ? (
          <p className="no-data">No books currently borrowed.</p>
        ) : (
          <div className="borrowed-list">
            {updatedBorrowedBooks.map(book => (
              <div key={book.id} className="borrowed-item">
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p className="author">by {book.author}</p>
                  <div className="borrow-details">
                    <span>Borrowed: {book.borrowDate}</span>
                    <span>Due: {book.dueDate}</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(book.status) }}
                    >
                      {book.status.toUpperCase()}
                    </span>
                    {book.status === "borrowing" && book.daysRemaining && (
                      <span className="days-remaining">{book.daysRemaining} days remaining</span>
                    )}
                    {book.status === "overdue" && book.daysOverdue && (
                      <span className="days-overdue">{book.daysOverdue} days overdue</span>
                    )}
                    {book.status === "returned" && (
                      <span className="return-date">Returned: {book.returnDate}</span>
                    )}
                  </div>
                </div>
                <div className="action-buttons">
                  {(book.status === "borrowing" || book.status === "overdue") && (
                    <button 
                      className="btn-return"
                      onClick={() => handleReturn(book.id)}
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPenaltiesTab = () => (
    <div className="tab-content">
      <div className="penalties-section">
        <h3>Your Penalties ({penalties.filter(p => p.status === "unpaid").length})</h3>
        {penalties.length === 0 ? (
          <p className="no-data">No penalties at this time. Keep returning books on time! 📚</p>
        ) : (
          <div className="penalties-list">
            {penalties.map(penalty => (
              <div key={penalty.id} className="penalty-item">
                <div className="penalty-info">
                  <h4>{penalty.bookTitle}</h4>
                  <p className="reason">Reason: {penalty.reason}</p>
                  <p className="amount">Amount: ${penalty.amount}</p>
                  <p className="status">Status: <span className={penalty.status}>{penalty.status}</span></p>
                  <p className="due-date">Due Date: {penalty.dueDate}</p>
                </div>
                {penalty.status === "unpaid" && (
                  <button 
                    className="btn-pay"
                    onClick={() => handlePayPenalty(penalty.id)}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAnnouncementsTab = () => (
    <div className="tab-content">
      <div className="announcements-section">
        <h3>Library Announcements</h3>
        <div className="announcements-list">
          {announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <h4>{announcement.title}</h4>
                <span className="announcement-date">{announcement.date}</span>
              </div>
              <p className="announcement-content">{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📚 ShelfSync</h1>
          <div className="user-info">
            <span>Welcome, <strong>{user?.name}</strong>!</span>
            <span className="user-role">({user?.role})</span>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          📖 Books
        </button>
        <button 
          className={`nav-btn ${activeTab === "borrowed" ? "active" : ""}`}
          onClick={() => setActiveTab("borrowed")}
        >
          📚 Borrowed Books ({updatedBorrowedBooks.filter(book => book.status !== "returned").length})
        </button>
        <button 
          className={`nav-btn ${activeTab === "penalties" ? "active" : ""}`}
          onClick={() => setActiveTab("penalties")}
        >
          ⚠️ Penalties ({penalties.filter(p => p.status === "unpaid").length})
        </button>
        <button 
          className={`nav-btn ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          📢 Announcements
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === "books" && renderBooksTab()}
        {activeTab === "borrowed" && renderBorrowedTab()}
        {activeTab === "penalties" && renderPenaltiesTab()}
        {activeTab === "announcements" && renderAnnouncementsTab()}
      </main>
    </div>
  );
}

// Separate BookCard component
const BookCard = ({ book, onBorrow }) => {
  return (
    <div className="book-card">
      <div className="book-cover">{book.cover}</div>
      <div className="book-content">
        <h4 className="book-title">{book.title}</h4>
        <p className="book-author">by {book.author}</p>
        <p className="book-description">{book.description}</p>
        <div className="book-meta">
          <span className="book-subject">{book.subject}</span>
          {book.isNew && <span className="new-badge">NEW</span>}
          <span className={`status ${book.status}`}>
            {book.status === "available" ? `${book.availableCopies} available` : book.status}
          </span>
        </div>
        <button 
          className="btn-borrow"
          onClick={() => onBorrow(book.id)}
          disabled={book.status !== "available"}
        >
          {book.status === "available" ? "Borrow Book" : "Not Available"}
        </button>
      </div>
    </div>
  );
};